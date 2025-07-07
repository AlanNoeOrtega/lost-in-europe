import {
  IsString,
  IsIn,
  ValidateNested,
  IsObject,
  IsNotEmpty,
} from 'class-validator';
import { Type, TypeHelpOptions } from 'class-transformer';
import { TrainDetailsDto } from './details/train-details.dto';
import { AirplaneDetailsDto } from './details/airplane-details.dto';
import { BaseDetailsDto } from './details/base-details.dto';
import { TramDetailsDto } from './details/tram-details.dto';
import { ApiProperty } from '@nestjs/swagger';

export class TicketDto {
  @ApiProperty({
    enum: ['train', 'tram', 'airplane'],
    description: 'Type of ticket',
  })
  @IsIn(['train', 'tram', 'airplane'])
  @IsNotEmpty()
  readonly type: string;

  @ApiProperty({ description: 'Origin location' })
  @IsString()
  @IsNotEmpty()
  readonly from: string;

  @ApiProperty({ description: 'Destination location' })
  @IsString()
  @IsNotEmpty()
  readonly to: string;

  @ApiProperty({
    oneOf: [
      { $ref: '#/components/schemas/TrainDetailsDto' },
      { $ref: '#/components/schemas/AirplaneDetailsDto' },
      { $ref: '#/components/schemas/TramDetailsDto' },
      { $ref: '#/components/schemas/BaseDetailsDto' },
    ],
    description: 'Details for the ticket type',
    required: false,
  })
  @IsObject()
  @ValidateNested()
  @Type((type?: TypeHelpOptions) => {
    const ticketDTO = type?.object as TicketDto;

    switch (ticketDTO.type) {
      case 'tram':
        return TramDetailsDto;
      case 'train':
        return TrainDetailsDto;
      case 'airplane':
        return AirplaneDetailsDto;
      default:
        return BaseDetailsDto;
    }
  })
  readonly details?:
    | TrainDetailsDto
    | AirplaneDetailsDto
    | TramDetailsDto
    | BaseDetailsDto;
}
