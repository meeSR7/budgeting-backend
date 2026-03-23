import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: "your_jwt_secret_key", // Replace with your own secret key
      signOptions: { expiresIn: '1d' }, // Token expiration time
    })
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
