import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiTags,
  ApiExtraModels,
  ApiOperation,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { TicketDto } from './dto/tickets.dto';
import { TicketsArrayDto } from './dto/tickets-array.dto';
import { TicketsService } from './tickets.service';
import { TrainDetailsDto } from './dto/details/train-details.dto';
import { AirplaneDetailsDto } from './dto/details/airplane-details.dto';
import { TramDetailsDto } from './dto/details/tram-details.dto';
import { BaseDetailsDto } from './dto/details/base-details.dto';
import { mockSortedTickets, mockTickets } from './mocks/tickets.mock';

@ApiTags('tickets')
@ApiExtraModels(
  TicketDto,
  TrainDetailsDto,
  AirplaneDetailsDto,
  TramDetailsDto,
  BaseDetailsDto,
)
@Controller('tickets')
export class TicketsController {
  constructor(private ticketsService: TicketsService) {}

  /**
   * Sorts an array of travel tickets into the correct order and saves the itinerary.
   *
   * @param ticketsArrayDTO - The request body containing an array of tickets to be sorted.
   * @returns An object with the sorted tickets and a unique identifier for the saved itinerary.
   *
   * Request body example:
   * {
   *   "tickets": [
   *     { "type": "train", "from": "A", "to": "B", "details": { "note": "A to B" } },
   *     { "type": "train", "from": "B", "to": "C", "details": { "note": "B to C" } }
   *   ]
   * }
   *
   * Response example:
   * {
   *   "tickets": [
   *     { "type": "train", "from": "A", "to": "B", "details": { "note": "A to B" } },
   *     { "type": "train", "from": "B", "to": "C", "details": { "note": "B to C" } }
   *   ],
   *   "identifier": 1
   * }
   */
  @Post('sort')
  @ApiOperation({
    summary: 'Sort tickets and save itinerary',
    description:
      'Sorts an array of travel tickets into the correct order and saves the itinerary. Returns the sorted tickets and a unique identifier.',
  })
  @ApiBadRequestResponse({
    description:
      'No starting point found, not all tickets could be sorted, or invalid input.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Database error or server error.',
  })
  @ApiBody({
    type: TicketsArrayDto,
    description: 'Array of tickets to be sorted',
    examples: {
      default: {
        summary: 'Example request',
        value: {
          tickets: mockTickets,
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Sorted tickets and itinerary identifier',
    schema: {
      type: 'object',
      properties: {
        tickets: {
          type: 'array',
          items: { $ref: '#/components/schemas/TicketDto' },
        },
        identifier: { type: 'integer' },
      },
    },
    examples: {
      default: {
        summary: 'Example response',
        value: {
          tickets: mockSortedTickets,
          identifier: 4,
        },
      },
    },
  })
  async sortTickets(@Body() ticketsArrayDTO: TicketsArrayDto) {
    const sortedTickets = this.ticketsService.sort(ticketsArrayDTO.tickets);
    const identifier = await this.ticketsService.saveItinerary({
      tickets: sortedTickets,
    } as TicketsArrayDto);

    const response = {
      tickets: sortedTickets,
      identifier,
    };

    return response;
  }

  /**
   * Retrieves the itinerary instructions for a given identifier.
   *
   * @param id - The unique identifier for the saved itinerary.
   * @returns An object containing an array of itinerary instructions as strings.
   *
   * Response example:
   * {
   *   "itinerary": [
   *     "0. Start.",
   *     "1. Board train 123, Platform 1 from A to B. Seat number 10.",
   *     "2. Board the Tram T1 from B to C.",
   *     "3. From C, board flight F456 to D from gate G2, seat 22A.",
   *     "4. Last destination reached."
   *   ]
   * }
   */
  @ApiOperation({
    summary: 'Get itinerary instructions',
    description:
      'Retrieves the itinerary instructions for a given identifier. Returns an array of step-by-step instructions as strings.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid itinerary format or itinerary not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Database error or server error.',
  })
  @Get('itinerary/:id')
  @ApiOkResponse({
    description: 'Itinerary instructions',
    schema: {
      type: 'object',
      properties: {
        itinerary: { type: 'array', items: { type: 'string' } },
      },
    },
    examples: {
      default: {
        summary: 'Example itinerary response',
        value: {
          itinerary: [
            '0. Start.',
            '1. Boar train RJX 765, Platform 1 from St Anton am Arlberg Bahnhof to Innsbruck Hbf. Seat number 17C.',
            '2. Board the Tram S5 from Innsbruck Hbf to Innsbruck Airport.',
            '3. From Innsbruck Airport, board flight AA904 to Venice Airport from gate 10, seat 18B.',
            '4. Last destination reached.',
          ],
        },
      },
    },
  })
  async getItinerary(@Param('id', ParseIntPipe) id: number) {
    const itinerary = await this.ticketsService.getItinerary(id);
    return { itinerary };
  }
}
