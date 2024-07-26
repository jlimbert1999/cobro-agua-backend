import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { MeterReading } from '../schemas';
import { CustomerType } from './customer-type.entity';
import { Invoice } from './invoice.entity';
import { Payment } from 'src/payment/entities/payment.entity';

export enum CustomerStatus {
  ENABLED = 'enabled',
  DISABLED = 'disabled',
}

@Entity()
export class Customer {
  @Column()
  firstname: string;

  @Column()
  middlename: string;

  @Column()
  lastname: number;

  @Column({ unique: true })
  dni: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column({
    type: 'enum',
    enum: CustomerStatus,
    default: CustomerStatus.ENABLED,
  })
  status: CustomerStatus;

  @OneToMany(() => MeterReading, (reading) => reading.client)
  readings: MeterReading[];

  @ManyToOne(() => CustomerType, (customerType) => customerType.customers)
  type: CustomerType;

  @OneToMany(() => Invoice, (invoice) => invoice.customer)
  invoices: Invoice[];

  @OneToMany(() => Payment, (payment) => payment.customer)
  payments: Payment[];
}
