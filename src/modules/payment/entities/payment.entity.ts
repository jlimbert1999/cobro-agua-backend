import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Customer } from 'src/modules/consumer/entities/customer.entity';
import { Invoice } from 'src/modules/consumer/entities/invoice.entity';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column({ type: 'float' })
  amount: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Invoice, (invoice) => invoice.payment)
  invoices: Invoice[];

  @ManyToOne(() => Customer, (customer) => customer.payments)
  customer: Customer;

  @Column({ nullable: true })
  customerId: string;
}
