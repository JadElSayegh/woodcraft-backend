// CreateProductPhotoDto: validate payload for uploading a product photo record
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateProductPhotoDto {
  @IsString()
  image: string;

  @IsOptional()
  @IsInt()
  order?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
