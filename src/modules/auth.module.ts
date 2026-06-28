import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { JwtStrategy } from '../services/jwt.strategy';
import { TokenService } from '../services/token.service';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [ConfigModule, JwtModule.register({}), PassportModule, PrismaModule],
  controllers: [AuthController],
  providers: [AuthService, TokenService, JwtStrategy],
})
export class AuthModule {}
