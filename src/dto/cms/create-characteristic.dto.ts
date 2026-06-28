// CreateCharacteristicDto: validate payload for adding a characteristic
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateCharacteristicDto {
  @IsString()
  text: string;

  @IsBoolean()
  isPositive: boolean;

  @IsOptional()
  @IsInt()
  order?: number;
}
