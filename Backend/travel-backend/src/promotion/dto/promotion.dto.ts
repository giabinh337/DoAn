import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePromotionDto {
  @ApiProperty({ description: 'Mã giảm giá', example: 'SUMMER2026' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: 'Số tiền giảm', example: 500000 })
  @IsNumber()
  @Min(0)
  discountValue: number;
}
