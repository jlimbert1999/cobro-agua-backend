import { Column, Entity, ManyToOne } from 'typeorm';
import { CustomerType } from './customer-type.entity';

@Entity()
export class Preference {
  @Column()
  maxUnits: number;

  @Column()
  minUnits: number;

  @Column()
  priceByUnit: number;

  @Column()
  maxDelayMonths: number;

  @ManyToOne(() => CustomerType, (customerType) => customerType.preferences)
  customerType: CustomerType;
}
