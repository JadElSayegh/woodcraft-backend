// UpdateHomepageDto: validate payload for modifying homepage content
import { IsOptional, IsString } from 'class-validator';

export class UpdateHomepageDto {
  @IsOptional()
  @IsString()
  heroTitle?: string;

  @IsOptional()
  @IsString()
  heroSubtitle?: string;

  @IsOptional()
  @IsString()
  heroButtonText?: string;

  @IsOptional()
  @IsString()
  heroButtonLink?: string;

  @IsOptional()
  @IsString()
  heroBackgroundImage?: string;

  @IsOptional()
  @IsString()
  heroImageOne?: string;

  @IsOptional()
  @IsString()
  heroImageTwo?: string;

  @IsOptional()
  @IsString()
  heroImageThree?: string;
}
