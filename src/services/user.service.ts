import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/repositories/user.repository';
import { ApiResponse } from 'src/utils/api-response.util';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async getInfo(userId: number) {
    const user = await this.userRepository.findById(userId);
    if (user) {
      return ApiResponse(user, HttpStatus.OK, 'Success');
    } else {
      throw new BadRequestException('User not found');
    }
  }
}
