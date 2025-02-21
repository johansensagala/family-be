import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { FinalRound } from './final-round.entity';
import { Question } from './question.entity';

@Entity()
export class FinalRoundQuestion {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => FinalRound, finalRound => finalRound.finalRoundQuestions)
  finalRound: FinalRound;

  @ManyToOne(() => Question, question => question.finalRoundQuestions)
  question: Question;
}
