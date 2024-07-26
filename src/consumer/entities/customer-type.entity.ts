import { Column, Entity, OneToMany } from 'typeorm';
import { Preference } from './preference.entity';
import { Customer } from './customer.entity';

@Entity()
export class CustomerType {
  @Column()
  name: string;

  @OneToMany(() => Preference, (preference) => preference.customerType)
  preferences: Preference[];

  @OneToMany(() => Customer, (customer) => customer.type)
  customers: Customer[];
}
