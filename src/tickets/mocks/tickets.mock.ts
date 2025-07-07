import { TicketDto } from '../dto/tickets.dto';

export const mockTickets: TicketDto[] = [
  {
    type: 'airplane',
    from: 'Innsbruck Airport',
    to: 'Venice Airport',
    details: {
      flight: 'AA904',
      gate: '10',
      seat: '18B',
    },
  },
  {
    type: 'tram',
    from: 'Innsbruck Hbf',
    to: 'Innsbruck Airport',
    details: {
      tram: 'S5',
    },
  },
  {
    type: 'train',
    from: 'St Anton am Arlberg Bahnhof',
    to: 'Innsbruck Hbf',
    details: {
      platform: '1',
      train: 'RJX 765',
      seat: '17C',
    },
  },
];

export const mockSortedTickets: TicketDto[] = [
  {
    type: 'train',
    from: 'St Anton am Arlberg Bahnhof',
    to: 'Innsbruck Hbf',
    details: {
      platform: '1',
      train: 'RJX 765',
      seat: '17C',
    },
  },
  {
    type: 'tram',
    from: 'Innsbruck Hbf',
    to: 'Innsbruck Airport',
    details: {
      tram: 'S5',
    },
  },
  {
    type: 'airplane',
    from: 'Innsbruck Airport',
    to: 'Venice Airport',
    details: {
      flight: 'AA904',
      gate: '10',
      seat: '18B',
    },
  },
];
