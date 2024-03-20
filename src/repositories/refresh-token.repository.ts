import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from 'src/entities/refresh-token';
import { Repository } from 'typeorm';

export class RefreshTokenRepository extends Repository<RefreshToken> {
  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: RefreshTokenRepository,
  ) {
    super(
      refreshTokenRepository.target,
      refreshTokenRepository.manager,
      refreshTokenRepository.queryRunner,
    );
  }
}
