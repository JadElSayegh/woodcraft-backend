// TokenService: creates JWT access and refresh tokens
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { SignOptions } from 'jsonwebtoken';
import { JwtPayload } from '../common/types/jwt-payload.type';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async generateTokens(payload: JwtPayload) {
    // generateTokens: sign and return access + refresh tokens
    const accessTokenExpiresIn =
      this.config.get<string>('ACCESS_TOKEN_EXPIRES_IN') || '15m';

    const refreshTokenExpiresIn =
      this.config.get<string>('REFRESH_TOKEN_EXPIRES_IN') || '7d';

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'),
      expiresIn: accessTokenExpiresIn as SignOptions['expiresIn'],
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      expiresIn: refreshTokenExpiresIn as SignOptions['expiresIn'],
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
