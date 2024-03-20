import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cateogry } from './category';
import { Status } from 'src/enums/status.enum';
import { User } from './user.entity';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    precision: 11,
    scale: 2,
    type: 'double',
    nullable: false,
    default: 0,
  })
  unit_price: number;

  @Column({ nullable: false })
  quantity: number;

  @ManyToOne(() => Cateogry)
  @JoinColumn({ name: 'category_id' })
  category: Cateogry;

  @Column({ default: Status.ACTIVE })
  status: Status;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_id' })
  created_by: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'updated_by_id' })
  updated_by: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', onUpdate: 'CURRENT_TIMESTAMP', nullable: true })
  updated_at: Date;
}
