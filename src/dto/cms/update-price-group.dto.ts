// UpdatePriceGroupDto: validate payload for updating a price group
import { IsNumber, IsOptional } from 'class-validator';

export class UpdatePriceGroupDto {
  @IsOptional()
  @IsNumber()
  height?: number;

  @IsOptional()
  @IsNumber()
  thickness?: number;

  @IsOptional()
  @IsNumber()
  pricePerM3?: number;
}
