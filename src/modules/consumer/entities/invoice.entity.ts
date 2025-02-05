import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Customer } from './customer.entity';
import { Payment } from 'src/modules/payment/entities/payment.entity';
import { MeterReading } from './meter-reading.entity';
import { DiscountDetails } from './discount-details.entity';

export enum InvoiceStatus {
  UNPAID = 'unpaid',
  PAID = 'paid',
}

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  amount: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'enum', enum: InvoiceStatus, default: InvoiceStatus.UNPAID })
  status: InvoiceStatus;

  @OneToOne(() => MeterReading, { onDelete: 'CASCADE' })
  @JoinColumn()
  service: MeterReading;

  @ManyToOne(() => Customer, (customer) => customer.invoices, { onDelete: 'CASCADE' })
  customer: Customer;

  @ManyToOne(() => Payment, (payment) => payment.invoices)
  payment: Payment;

  @OneToOne(() => DiscountDetails, (discountDetails) => discountDetails.invoice, { cascade: true })
  discountDetails: DiscountDetails;

  @Column({ nullable: true })
  customerId: number;

  @Column({ nullable: true })
  paymentId: string;
}
