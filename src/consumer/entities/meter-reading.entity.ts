import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Customer } from './customer.entity';

@Entity()
export class MeterReading{
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  previous_reading: number;

  @Column()
  current_reading: number;

  @Column()
  consumption: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Customer, (customer) => customer.readings)
  customer: Customer;
}