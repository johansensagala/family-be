import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Game } from './game.entity';
import { FinalRoundQuestion } from './final-round-question.entity';

@Entity()
export class FinalRound {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Game, game => game.finalRounds)
  game: Game;

  @OneToMany(() => FinalRoundQuestion, finalRoundQuestion => finalRoundQuestion.finalRound)
  finalRoundQuestions: FinalRoundQuestion[];
}
