import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Invoice } from './invoice.entity';

@Entity()
export class DiscountDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Invoice, (invoice) => invoice.discountDetails, { onDelete: 'CASCADE' })
  @JoinColumn()
  invoice: Invoice;

  @Column()
  name: string;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  percentage: number;

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

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  originalAmount: number;
}
