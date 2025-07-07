import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TicketDto } from './dto/tickets.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ItinerariesEntity } from './repository/itineraries.entity';
import { Repository } from 'typeorm';
import { TicketsArrayDto } from './dto/tickets-array.dto';
import { ticketToInstructions } from './utils/ticket-to-instructions';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(ItinerariesEntity)
    private itinerariesRepository: Repository<ItinerariesEntity>,
  ) {}

  sort(tickets: TicketDto[]): TicketDto[] {
    const from: Record<string, number> = {};
    const toSet: Set<string> = new Set();

    for (let i = 0; i < tickets.length; i++) {
      const ticket = tickets[i];
      from[ticket.from] = i;
      toSet.add(ticket.to);
    }

    let startPointIndex: number | undefined = undefined;
    for (let i = 0; i < tickets.length; i++) {
      const ticket = tickets[i];
      if (!toSet.has(ticket.from)) {
        startPointIndex = i;
        break;
      }
    }

    if (startPointIndex === undefined) {
      throw new HttpException(
        'No starting point found',
        HttpStatus.BAD_REQUEST,
      );
    }

    let currentNode: TicketDto = tickets[startPointIndex];
    const sortedTickets: TicketDto[] = [currentNode];
    let nextNodeIndex = from[currentNode.to];

    while (nextNodeIndex !== undefined) {
      currentNode = tickets[nextNodeIndex];
      sortedTickets.push(currentNode);
      nextNodeIndex = from[currentNode.to];
    }

    if (sortedTickets.length !== tickets.length) {
      throw new HttpException(
        'Not all tickets could be sorted',
        HttpStatus.BAD_REQUEST,
      );
    }

    return sortedTickets;
  }

  async saveItinerary(ticketsArray: TicketsArrayDto): Promise<number> {
    const itinerary = new ItinerariesEntity();
    itinerary.tickets = JSON.stringify(ticketsArray);

    try {
      await this.itinerariesRepository.save(itinerary);
      return itinerary.id;
    } catch (error) {
      throw new HttpException(
        'Error saving itinerary to the database',
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  async getItinerary(id: number): Promise<string[]> {
    let itinerary: ItinerariesEntity | null = null;

    try {
      itinerary = await this.itinerariesRepository.findOne({
        where: { id },
      });
    } catch (error) {
      throw new HttpException(
        'DB error while fetching itinerary',
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }

    if (!itinerary) {
      throw new HttpException('Itinerary not found', HttpStatus.BAD_REQUEST);
    }

    try {
      const ticketsArrayDTO = JSON.parse(itinerary.tickets) as TicketsArrayDto;
      const instructions: string[] = ticketsArrayDTO.tickets.map(
        (ticket, index) => {
          return `${index + 1}. ` + ticketToInstructions(ticket);
        },
      );
      instructions.unshift('0. Start.');
      instructions.push(instructions.length + '. Last destination reached.');

      return instructions;
    } catch (error) {
      throw new HttpException(
        'Invalid itinerary format',
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }
}
