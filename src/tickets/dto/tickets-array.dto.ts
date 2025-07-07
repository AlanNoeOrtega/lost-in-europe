import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { TicketDto } from './tickets.dto';
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';

export class TicketsArrayDto {
  @ApiProperty({
    type: 'array',
    items: { $ref: getSchemaPath(TicketDto) },
    description: 'Array of tickets',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @IsNotEmpty()
  @Type(() => TicketDto)
  readonly tickets: TicketDto[];
}
