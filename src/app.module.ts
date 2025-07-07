import { Module } from '@nestjs/common';
import { TicketsModule } from './tickets/tickets.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItinerariesEntity } from './tickets/repository/itineraries.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'for-dev-only',
      database: 'lost_in_europe',
      entities: [ItinerariesEntity],
      synchronize: true, // for-dev-only
    }),
    TicketsModule,
  ],
})
export class AppModule {}
