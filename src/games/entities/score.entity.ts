import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Score {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  team_a_score: number;

  @Column({ default: 0 })
  team_b_score: number;

  @Column({ default: 0 })
  final_round_scores: number;
}
