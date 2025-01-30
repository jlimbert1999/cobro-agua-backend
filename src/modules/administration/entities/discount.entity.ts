import { Customer } from 'src/modules/consumer/entities';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Discount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  percentage: number;

  @OneToMany(() => Customer, (customer) => customer.discount)
  customers: Customer[];
}
