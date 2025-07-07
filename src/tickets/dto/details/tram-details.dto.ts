import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { BaseDetailsDto } from './base-details.dto';

export class TramDetailsDto extends BaseDetailsDto {
  @ApiProperty({ description: 'Tram identifier' })
  @IsString()
  readonly tram: string;
}
