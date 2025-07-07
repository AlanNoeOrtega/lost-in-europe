import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ItinerariesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: false })
  tickets: string;
}
