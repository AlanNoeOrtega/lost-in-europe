import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { BaseDetailsDto } from './base-details.dto';

export class TrainDetailsDto extends BaseDetailsDto {
  @ApiProperty({ description: 'Platform number' })
  @IsString()
  readonly platform: string;

  @ApiProperty({ description: 'Train identifier' })
  @IsString()
  readonly train: string;

  @ApiProperty({ description: 'Seat number' })
  @IsString()
  readonly seat: string;
}
