import { Module } from '@nestjs/common';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { ItinerariesEntity } from './repository/itineraries.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ItinerariesEntity])],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}
