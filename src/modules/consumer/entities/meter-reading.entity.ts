import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
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

  @Column()
  year: number;

  @Column()
  month: number;

  @ManyToOne(() => Customer, (customer) => customer.readings)
  customer: Customer;

  @Column({ nullable: true })
  customerId: number;

  @OneToOne(() => Invoice, (invoice) => invoice.service, { onDelete: 'CASCADE' })
  invoice: Invoice;
}
