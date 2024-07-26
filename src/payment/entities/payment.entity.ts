import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Customer } from 'src/consumer/entities/customer.entity';
import { Invoice } from 'src/consumer/entities/invoice.entity';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  code: string;

  @Column()
  amount: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Invoice, (invoice) => invoice.payment)
  invoices: Invoice[];

  @ManyToOne(() => Customer, (customer) => customer.payments)
  customer: Customer;
}
