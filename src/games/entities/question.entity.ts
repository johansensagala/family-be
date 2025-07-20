import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Answer } from './answer.entity';
import { FinalRoundQuestion } from './final-round-question.entity';
import { Round } from './round.entity';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  question: string;

  @OneToMany(() => Round, round => round.question)
  rounds: Round[];

  @OneToMany(() => FinalRoundQuestion, finalRoundQuestion => finalRoundQuestion.question)
  finalRoundQuestions: FinalRoundQuestion[];

  @OneToMany(() => Answer, answer => answer.question, { cascade: true, eager: true })
  answers: Answer[];
}
