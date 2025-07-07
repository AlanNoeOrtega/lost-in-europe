import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { BaseDetailsDto } from './base-details.dto';

export class AirplaneDetailsDto extends BaseDetailsDto {
  @ApiProperty({ description: 'Flight number' })
  @IsString()
  readonly flight: string;

  @ApiProperty({ description: 'Gate number' })
  @IsString()
  readonly gate: string;

  @ApiProperty({ description: 'Seat number' })
  @IsString()
  readonly seat: string;
}
