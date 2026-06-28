import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateCharacteristicDto {
  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsBoolean()
  isPositive?: boolean;

  @IsOptional()
  @IsInt()
  order?: number;
}
