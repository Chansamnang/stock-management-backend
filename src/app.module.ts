import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { typeOrmConfig } from './config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './services/auth.service';
import { UserRepository } from './repositories/user.repository';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { Session } from './entities/session.entity';
import { UserController } from './controller/user.controller';
import { UserService } from './services/user.service';
import { LogRepository } from './repositories/log.repository';
import { Log } from './entities/log.entity';
import { Cateogry } from './entities/category';
import { CategoryController } from './controller/category.controller';
import { CategoryRepository } from './repositories/category.repository';
import { AwsS3Controller } from './controller/aws.controller';
import { AwsS3Service } from './services/aws-s3.service';
import { Product } from './entities/product';
import { ProductController } from './controller/product.controller';
import { ProductRepository } from './repositories/product.repository';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { HttpExceptionFilter } from './middleware/http.exception.filter';
import { CategoryService } from './services/category.service';
import { ProductService } from './services/product.service';
import { ConfigModule } from '@nestjs/config';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import { RefreshToken } from './entities/refresh-token';
import { SessionRepository } from './repositories/session.repository';
import { RefreshTokenStategy } from './strategy/refresh-token.strategy';
import { PassportModule } from '@nestjs/passport';
import { AccessTokenGuard } from './guards/access-token.guard';
import { AccessTokenStrategy } from './strategy/access-token.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([
      User,
      Session,
      Log,
      Cateogry,
      Product,
      RefreshToken,
      UserRepository,
    ]),
  ],

  controllers: [
    AuthController,
    UserController,
    CategoryController,
    ProductController,
    AwsS3Controller,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    CategoryService,
    AwsS3Service,
    AppService,
    AuthService,
    ProductService,
    UserRepository,
    JwtService,
    UserService,
    LogRepository,
    CategoryRepository,
    ProductRepository,
    SessionRepository,
    RefreshTokenRepository,
    AccessTokenStrategy,
    RefreshTokenStategy,
  ],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(AuthMiddleware, LoggerMiddleware).forRoutes('*');
  // }
}
