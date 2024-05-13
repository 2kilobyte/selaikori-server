import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [PassportModule, JwtModule.register({
        secret: 'your_jwt_secret',
        signOptions: { expiresIn: '120m' },
      })],
    providers: [AuthService],
    controllers: [AuthController]
})
export class AuthModule {}
