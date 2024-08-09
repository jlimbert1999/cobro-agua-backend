import { Entity, Column, OneToMany, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { Invoice } from './invoice.entity';
import { Payment } from 'src/modules/payment/entities/payment.entity';
import { MeterReading } from './meter-reading.entity';
import { CustomerType } from 'src/modules/administration/entities';

export enum CustomerStatus {
  ENABLED = 'enabled',
  DISABLED = 'disabled',
}

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  firstname: string;

  @Column({ nullable: true })
  middlename: string;

  @Column({ nullable: true })
  lastname: string;

  @Column({ nullable: true })
  dni: string;

  @Column({ nullable: true })
  phone: string;

  @Column()
  meterNumber: string;

  @Column({
    type: 'enum',
    enum: CustomerStatus,
    default: CustomerStatus.ENABLED,
  })
  status: CustomerStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @OneToMany(() => MeterReading, (reading) => reading.customer)
  readings: MeterReading[];

  @ManyToOne(() => CustomerType, (customerType) => customerType.customers)
  type: CustomerType;

  @OneToMany(() => Invoice, (invoice) => invoice.customer)
  invoices: Invoice[];

  @OneToMany(() => Payment, (payment) => payment.customer)
  payments: Payment[];
}
