// CreatePriceVariantDto: validate payload for adding a pricing variant
import { IsInt, IsNumber, IsOptional } from 'class-validator';

export class CreatePriceVariantDto {
  @IsNumber()
  length: number;

  @IsNumber()
  volumeM3: number;

  @IsNumber()
  pricePerPiece: number;

  @IsOptional()
  @IsInt()
  order?: number;
}
