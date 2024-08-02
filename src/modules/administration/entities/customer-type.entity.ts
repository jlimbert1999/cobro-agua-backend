import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Preference } from './preference.entity';
import { Customer } from 'src/modules/consumer/entities';

@Entity()
export class CustomerType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  minimumPrice: number;

  @Column()
  maxDelayMonths: number;

  @OneToMany(() => Preference, (preference) => preference.customerType, { cascade: true })
  preferences: Preference[];

  @OneToMany(() => Customer, (customer) => customer.type)
  customers: Customer[];
}
