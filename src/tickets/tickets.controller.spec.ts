import { Test, TestingModule } from '@nestjs/testing';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { TicketsArrayDto } from './dto/tickets-array.dto';
import { mockTickets } from './mocks/tickets.mock';

describe('TicketsController', () => {
  let controller: TicketsController;
  let service: TicketsService;

  const mockTicketsService = {
    sort: jest.fn().mockReturnValue({
      tickets: mockTickets,
      identifier: 123,
    }),
    saveItinerary: jest.fn(() => Promise.resolve(123)),
    getItinerary: jest.fn((id: number) =>
      Promise.resolve([
        '0. Start.',
        `1. Ticket for id ${id}`,
        '2. Last destination reached.',
      ]),
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketsController],
      providers: [{ provide: TicketsService, useValue: mockTicketsService }],
    }).compile();

    controller = module.get<TicketsController>(TicketsController);
    service = module.get<TicketsService>(TicketsService);
  });

  it('should sort tickets and return response', async () => {
    const ticketsArrayDTO: TicketsArrayDto = {
      tickets: mockTickets,
    };

    const result = await controller.sortTickets(ticketsArrayDTO);

    const sortSpy = jest.spyOn(service, 'sort');
    expect(sortSpy).toHaveBeenCalledWith(mockTickets);

    const saveItinerarySpy = jest.spyOn(service, 'saveItinerary');
    expect(saveItinerarySpy).toHaveBeenCalled();

    expect(result).toHaveProperty('tickets');
    expect(result).toHaveProperty('identifier', 123);
  });

  it('should get itinerary by id', async () => {
    const id = 1;
    const result = await controller.getItinerary(id);
    const getItinerarySpy = jest.spyOn(service, 'getItinerary');

    expect(getItinerarySpy).toHaveBeenCalledWith(id);
    expect(result).toHaveProperty('itinerary');
    expect(Array.isArray(result.itinerary)).toBe(true);
  });
});
