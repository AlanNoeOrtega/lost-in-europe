import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class BaseDetailsDto {
  @ApiProperty({ required: false, description: 'Optional note' })
  @IsString()
  @IsOptional()
  readonly note?: string;
}
