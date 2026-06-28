import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateProductPhotoDto {
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
