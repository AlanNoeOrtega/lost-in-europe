import { TicketDto } from '../dto/tickets.dto';
import { AirplaneDetailsDto } from '../dto/details/airplane-details.dto';
import { TrainDetailsDto } from '../dto/details/train-details.dto';
import { TramDetailsDto } from '../dto/details/tram-details.dto';

export function ticketToInstructions(ticket: TicketDto): string {
  let instructions = `Ticket type not recognized: ${ticket.type}. Please provide a valid ticket type.`;

  if (ticket.type === 'airplane') {
    const details = ticket.details as AirplaneDetailsDto;
    instructions = `From ${ticket.from}, board flight ${details.flight} to ${ticket.to} from gate ${details.gate}, seat ${details.seat}.`;
  }

  if (ticket.type === 'train') {
    const details = ticket.details as TrainDetailsDto;
    instructions = `Boar train ${details.train}, Platform ${details.platform} from ${ticket.from} to ${ticket.to}. Seat number ${details.seat}.`;
  }

  if (ticket.type === 'tram') {
    const details = ticket.details as TramDetailsDto;
    instructions = `Board the Tram ${details.tram} from ${ticket.from} to ${ticket.to}.`;
  }

  if (ticket.details?.note) {
    instructions += `  ${ticket.details.note}`;
  }

  return instructions;
}
