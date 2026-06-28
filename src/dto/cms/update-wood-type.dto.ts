// UpdateWoodTypeDto: validate payload for updating a wood type
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateWoodTypeDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsInt()
  order?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
