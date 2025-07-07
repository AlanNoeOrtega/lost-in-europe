import { Test, TestingModule } from '@nestjs/testing';
import { TicketsService } from './tickets.service';
import { TicketDto } from './dto/tickets.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ItinerariesEntity } from './repository/itineraries.entity';

describe('TicketsService', () => {
  let service: TicketsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsService,
        {
          provide: getRepositoryToken(ItinerariesEntity),
          useValue: {}, // simple mock, extend as needed
        },
      ],
    }).compile();

    service = module.get<TicketsService>(TicketsService);
  });

  describe('sort', () => {
    it('should sort tickets in correct order', () => {
      const tickets: TicketDto[] = [
        { type: 'train', from: 'B', to: 'C', details: { note: 'B to C' } },
        { type: 'train', from: 'A', to: 'B', details: { note: 'A to B' } },
        { type: 'train', from: 'C', to: 'D', details: { note: 'C to D' } },
      ];
      const sorted = service.sort(tickets);
      expect(sorted.map((t) => t.from)).toEqual(['A', 'B', 'C']);
      expect(sorted.map((t) => t.to)).toEqual(['B', 'C', 'D']);
    });

    it('should throw if no starting point is found', () => {
      const tickets: TicketDto[] = [
        { type: 'train', from: 'A', to: 'B', details: { note: 'A to B' } },
        { type: 'train', from: 'B', to: 'A', details: { note: 'B to A' } },
      ];
      expect(() => service.sort(tickets)).toThrow('No starting point found');
    });

    it('should throw if not all tickets can be sorted', () => {
      const tickets: TicketDto[] = [
        { type: 'train', from: 'A', to: 'B', details: { note: 'A to B' } },
        { type: 'train', from: 'C', to: 'D', details: { note: 'C to D' } },
      ];
      expect(() => service.sort(tickets)).toThrow(
        'Not all tickets could be sorted',
      );
    });

    it('should handle already sorted tickets', () => {
      const tickets: TicketDto[] = [
        { type: 'train', from: 'A', to: 'B', details: { note: 'A to B' } },
        { type: 'train', from: 'B', to: 'C', details: { note: 'B to C' } },
        { type: 'train', from: 'C', to: 'D', details: { note: 'C to D' } },
      ];
      const sorted = service.sort(tickets);
      expect(sorted.map((t) => t.from)).toEqual(['A', 'B', 'C']);
      expect(sorted.map((t) => t.to)).toEqual(['B', 'C', 'D']);
    });
  });
});
