import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Equal, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from 'src/dto/auth/register.dto';
import {
  BadRequestException,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from 'src/dto/auth/login.dto';
import { Session } from 'src/entities/session.entity';
import { ApiResponse } from 'src/utils/api-response.util';
import { RefreshTokenRepository } from './refresh-token.repository';

export class UserRepository extends Repository<User> {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    private readonly jwtService: JwtService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {
    super(
      userRepository.target,
      userRepository.manager,
      userRepository.queryRunner,
    );
  }

  async register(body: RegisterDto) {
    const { username, password } = body;
    const oldUser = await this.userRepository.findOne({
      where: { username: username },
    });

    if (oldUser) {
      throw new BadRequestException('User already register');
    }

    const saltOrRounds = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, saltOrRounds);

    const user = this.userRepository.create({
      username: username,
      password: hashPassword,
      status: true,
    });

    await this.userRepository.save(user);

    return 'Register Sucessfully';
  }

  async login(body: LoginDto) {
    const { username, password } = body;
    const user = await this.userRepository.findOne({
      where: { username: username },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.status) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'account is disable',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'username/password is incorrect',
      });
    }

    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user.id, user);
    await this.createSession(accessToken, user);
    return ApiResponse(
      {
        username: user.username,
        status: user.status,
        accessToken: accessToken.accessToken,
        refreshToken: refreshToken,
      },
      HttpStatus.OK,
    );
  }

  async createSession(tokenDetail: any, userInfo: User) {
    const expireAt = new Date(Date.now() + 3600 * (100 * 240)); // 1 Day
    const userToDelete = await this.sessionRepository.findOne({
      relations: ['user'],
      where: { user: { id: Equal(userInfo.id) } },
    });
    if (userToDelete) {
      await this.sessionRepository.delete(userToDelete);
    }

    const session = this.sessionRepository.create({
      token: tokenDetail.accessToken,
      string_token: tokenDetail.tokenString,
      user: userInfo,
      expires_at: expireAt,
      is_expired: false,
    });

    await this.sessionRepository.save(session);
  }

  async findById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id: Equal(id) },
    });

    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...others } = user;
      return others;
    }
  }

  async findSessionToken(token: string) {
    const session = await this.sessionRepository.findOne({
      where: { token: token },
    });
    return session;
  }

  async generateAccessToken(user: User) {
    const saltOrRounds = 10;
    const payload = { sub: user.id, username: user.username };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1d',
    });
    const tokenString = await bcrypt.hash(accessToken, saltOrRounds);
    return { accessToken, tokenString };
  }

  async generateRefreshToken(userId: any, user: User) {
    const existRefreshToken = await this.refreshTokenRepository.findOneBy({
      user_id: userId,
    });

    if (existRefreshToken) {
      this.refreshTokenRepository.delete(existRefreshToken);
    }

    const expiredAt = new Date();
    expiredAt.setDate(expiredAt.getDate() + 7);
    const payload = { sub: user.id, username: user.username };
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
    });

    const refreshTokenData = this.refreshTokenRepository.create({
      user_id: userId,
      expire_at: expiredAt,
      refresh_token: refreshToken,
    });
    this.refreshTokenRepository.save(refreshTokenData);
    return refreshToken;
  }

  async removeRefreshToken(token: string) {
    const refreshToken = await this.findRefreshTokenByRefreshToken(token);
    if (refreshToken) {
      await this.refreshTokenRepository.delete(refreshToken);
    }
  }

  async findRefreshTokenByRefreshToken(token: string) {
    return await this.refreshTokenRepository.findOne({
      where: { refresh_token: token },
      relations: ['user'],
    });
  }

  async genNewRefreshToken(token: string) {
    const existRefreshToken = await this.findRefreshTokenByRefreshToken(token);
    if (
      !existRefreshToken ||
      new Date(existRefreshToken.expire_at) < new Date()
    ) {
      throw new BadRequestException('Refresh Token is invalid');
    }

    const user = await this.userRepository.findOne({
      where: { id: existRefreshToken.user_id.id },
    });

    const newAccessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user.id, user);
    await this.createSession(newAccessToken, user);
    const accessToken = newAccessToken.accessToken;

    return ApiResponse({ accessToken, refreshToken }, HttpStatus.OK, 'Success');
  }
}
