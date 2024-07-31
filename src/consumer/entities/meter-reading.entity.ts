import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Customer } from './customer.entity';
import { Invoice } from './invoice.entity';

@Entity()
export class MeterReading {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  reading: number;

  @Column()
  consumption: number;

  @Column({ type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(() => Customer, (customer) => customer.readings)
  customer: Customer;

  @Column({ nullable: true })
  customerId: string;

  @OneToOne(() => Invoice, (invoice) => invoice.service)
  invoice: Invoice;
}
