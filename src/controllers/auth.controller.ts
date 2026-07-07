// AuthController: exposes registration, login, refresh and logout endpoints
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { Request, Response } from 'express';
import type { JwtPayload } from '../common/types/jwt-payload.type';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/auth/login.dto';
import { RegisterDto } from '../dto/auth/register.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

const registerRequestExample = {
  email: 'admin@example.com',
  password: 'Password123',
  role: 'ADMIN',
};

const registerResponseExample = {
  id: '7f3d8d5b-5f12-4eb7-8c15-9f4fd4fe7b29',
  email: 'admin@example.com',
  role: 'ADMIN',
  createdAt: '2026-06-28T12:00:00.000Z',
};

const loginRequestExample = {
  email: 'admin@example.com',
  password: 'Password123',
};

const loginResponseExample = {
  user: {
    id: '7f3d8d5b-5f12-4eb7-8c15-9f4fd4fe7b29',
    email: 'admin@example.com',
    role: 'ADMIN',
  },
  message: 'Logged in successfully.',
};

const responseMessageExample = (message: string) => ({
  message,
});

type AuthUser = {
  id: string;
  email: string;
  role: JwtPayload['role'];
  createdAt?: string;
};

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new account' })
  @ApiBody({
    description: 'Create a user account. Role defaults to USER when omitted.',
    schema: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: {
          type: 'string',
          format: 'email',
          example: registerRequestExample.email,
        },
        password: {
          type: 'string',
          minLength: 6,
          example: registerRequestExample.password,
        },
        role: {
          type: 'string',
          enum: ['USER', 'ADMIN'],
          example: registerRequestExample.role,
        },
      },
      example: registerRequestExample,
    },
  })
  @ApiCreatedResponse({
    description: 'User created successfully.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            id: { type: 'string', example: registerResponseExample.id },
            email: { type: 'string', example: registerResponseExample.email },
            role: { type: 'string', example: registerResponseExample.role },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: registerResponseExample.createdAt,
            },
          },
          example: registerResponseExample,
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Validation failed or email is already registered.',
  })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Login and issue auth cookies',
    description:
      'Returns the authenticated user and sets `access_token` and `refresh_token` httpOnly cookies.',
  })
  @ApiBody({
    description: 'Submit email and password to receive auth cookies.',
    schema: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: {
          type: 'string',
          format: 'email',
          example: loginRequestExample.email,
        },
        password: {
          type: 'string',
          minLength: 6,
          example: loginRequestExample.password,
        },
      },
      example: loginRequestExample,
    },
  })
  @ApiOkResponse({
    description: 'Login successful and cookies were set.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  example: loginResponseExample.user.id,
                },
                email: {
                  type: 'string',
                  example: loginResponseExample.user.email,
                },
                role: {
                  type: 'string',
                  example: loginResponseExample.user.role,
                },
              },
            },
            message: { type: 'string', example: loginResponseExample.message },
          },
          example: loginResponseExample,
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  @ApiUnauthorizedResponse({ description: 'Invalid email or password.' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(dto);

    this.setAuthCookies(response, result.accessToken, result.refreshToken);

    return {
      user: result.user,
      message: 'Logged in successfully.',
    };
  }

  @Post('refresh')
  @ApiOperation({
    summary: 'Refresh access and refresh cookies',
    description:
      'Validates the `refresh_token` cookie and returns a new cookie pair.',
  })
  @ApiCookieAuth('refresh_token')
  @ApiOkResponse({
    description: 'Token pair refreshed successfully.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Token refreshed.' },
          },
          example: responseMessageExample('Token refreshed.'),
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Refresh token missing or invalid.' })
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    // refresh: verify refresh cookie, issue new tokens and overwrite cookies
    const cookies = request.cookies as Partial<Record<'refresh_token', string>>;
    const refreshToken = cookies.refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing.');
    }

    const payload = await this.jwtService.verifyAsync<JwtPayload>(
      refreshToken,
      {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      },
    );

    const tokens = await this.authService.refresh(payload.sub, refreshToken);

    this.setAuthCookies(response, tokens.accessToken, tokens.refreshToken);

    return { message: 'Token refreshed.' };
  }

  @Post('logout')
  @ApiOperation({
    summary: 'Logout and clear auth cookies',
    description:
      'Invalidates the refresh token when present and clears auth cookies.',
  })
  @ApiCookieAuth('refresh_token')
  @ApiOkResponse({
    description: 'Logged out successfully.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Logged out successfully.' },
          },
          example: responseMessageExample('Logged out successfully.'),
        },
      },
    },
  })
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const cookies = request.cookies as Partial<Record<'refresh_token', string>>;
    const refreshToken = cookies.refresh_token;

    if (refreshToken) {
      try {
        const payload = await this.jwtService.verifyAsync<JwtPayload>(
          refreshToken,
          {
            secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
          },
        );

        await this.authService.logout(payload.sub);
      } catch {
        // ignore invalid token during logout
      }
    }

    this.clearAuthCookies(response);

    return { message: 'Logged out successfully.' };
  }

  private setAuthCookies(
    response: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    // Use same-site cookies locally and cross-site cookies for deployed frontend URLs.
    const accessCookieOptions = this.getAuthCookieOptions(15 * 60 * 1000);
    const refreshCookieOptions = this.getAuthCookieOptions(
      7 * 24 * 60 * 60 * 1000,
    );

    response.cookie('access_token', accessToken, accessCookieOptions);
    response.cookie('refresh_token', refreshToken, refreshCookieOptions);
  }

  private clearAuthCookies(response: Response) {
    const cookieOptions = this.getAuthCookieOptions();

    response.clearCookie('access_token', cookieOptions);
    response.clearCookie('refresh_token', cookieOptions);
  }

  private getAuthCookieOptions(maxAge?: number) {
    const frontendUrl = this.config.get<string>('FRONTEND_URL');
    const isLocalFrontend = this.isLocalFrontendUrl(frontendUrl);

    return {
      httpOnly: true,
      sameSite: isLocalFrontend ? ('lax' as const) : ('none' as const),
      secure: !isLocalFrontend,
      path: '/',
      ...(maxAge !== undefined ? { maxAge } : {}),
    };
  }

  private isLocalFrontendUrl(frontendUrl?: string) {
    if (!frontendUrl) {
      return true;
    }

    try {
      const hostname = new URL(frontendUrl).hostname;

      return hostname === 'localhost' || hostname === '127.0.0.1';
    } catch {
      return true;
    }
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Get the currently authenticated user' })
  @ApiOkResponse({
    description: 'Current user returned.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'string', example: loginResponseExample.user.id },
                email: {
                  type: 'string',
                  example: loginResponseExample.user.email,
                },
                role: {
                  type: 'string',
                  example: loginResponseExample.user.role,
                },
              },
            },
          },
          example: {
            user: loginResponseExample.user,
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  me(@CurrentUser() user: AuthUser) {
    return { user };
  }
}
