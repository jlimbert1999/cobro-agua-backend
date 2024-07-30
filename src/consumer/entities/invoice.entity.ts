import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Customer } from './customer.entity';
import { Payment } from 'src/payment/entities/payment.entity';
import { MeterReading } from './meter-reading.entity';

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => MeterReading)
  @JoinColumn()
  service: MeterReading;

  @ManyToOne(() => Customer, (customer) => customer.invoices)
  customer: Customer;

  @ManyToOne(() => Payment, (payment) => payment.invoices)
  payment: Payment;

  @Column({ nullable: true })
  customerId: string;
}
