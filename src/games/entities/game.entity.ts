import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Round } from './round.entity';
import { FinalRound } from './final-round.entity';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @OneToMany(() => Round, round => round.game)
  rounds: Round[];

  @OneToMany(() => FinalRound, finalRound => finalRound.game)
  finalRounds: FinalRound[];  
}
