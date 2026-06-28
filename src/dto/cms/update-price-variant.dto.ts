// UpdatePriceVariantDto: validate payload for updating a price variant
import { IsInt, IsNumber, IsOptional } from 'class-validator';

export class UpdatePriceVariantDto {
  @IsOptional()
  @IsNumber()
  length?: number;

  @IsOptional()
  @IsNumber()
  volumeM3?: number;

  @IsOptional()
  @IsNumber()
  pricePerPiece?: number;

  @IsOptional()
  @IsInt()
  order?: number;
}
