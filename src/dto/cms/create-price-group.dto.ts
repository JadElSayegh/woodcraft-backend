// CreatePriceGroupDto: validate payload for creating a price group
import { IsNumber } from 'class-validator';

export class CreatePriceGroupDto {
  @IsNumber()
  height: number;

  @IsNumber()
  thickness: number;

  @IsNumber()
  pricePerM3: number;
}
