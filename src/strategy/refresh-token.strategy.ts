import { Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

export class RefreshTokenStategy extends PassportStrategy(
  Strategy,
  'refresh-token',
) {
  private readonly logger = new Logger(RefreshTokenStategy.name);

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_SECRET,
    });
    this.logger.warn('RefreshTokenStategy is initialized');
  }

  //   async validate(payload: any) {
  //     const refreshToken = await this.authService.findRefreshToken(payload.sub);

  //     if (!refreshToken || refreshToken.expiresIn < new Date()) {
  //       // Handle token expiration or invalid token
  //       return null;
  //     }

  //     return { userId: payload.sub };
  //   }
}
