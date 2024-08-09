import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CustomerType } from './customer-type.entity';

@Entity()
export class Preference {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  maxUnits: number;

  @Column()
  minUnits: number;

  @Column({ type: 'float' })
  priceByUnit: number;

  @ManyToOne(() => CustomerType, (customerType) => customerType.preferences, { onDelete: 'CASCADE' })
  customerType: CustomerType;
}
