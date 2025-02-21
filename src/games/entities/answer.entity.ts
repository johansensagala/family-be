import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './question.entity';

@Entity()
export class Answer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  answer: string;

  @Column()
  poin: number;

  @ManyToOne(() => Question, question => question.answers)
  question: Question;
}
