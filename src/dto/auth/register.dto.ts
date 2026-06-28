// RegisterDto: validate payload for user registration
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({
    example: 'admin@example.com',
    description: 'User email address.',
  })
  @IsEmail({}, { message: 'Please enter a valid email address.' })
  email: string;

  @ApiProperty({
    example: 'Password123',
    minLength: 6,
    description: 'New user password.',
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is required.' })
  @MinLength(6, { message: 'Password must be at least 6 characters.' })
  password: string;

  @ApiProperty({
    example: 'USER',
    description: 'User role.',
  })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
