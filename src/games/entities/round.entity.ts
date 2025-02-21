import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Game } from './game.entity';
import { Question } from './question.entity';

@Entity()
export class Round {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  type: string;

  @ManyToOne(() => Game, game => game.rounds)
  game: Game;

  @ManyToOne(() => Question, question => question.rounds)
  question: Question;
}
