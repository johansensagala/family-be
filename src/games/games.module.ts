import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { Round } from './entities/round.entity';
import { FinalRound } from './entities/final-round.entity';
import { FinalRoundQuestion } from './entities/final-round-question.entity';
import { Question } from './entities/question.entity';
import { Answer } from './entities/answer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Game, Round, FinalRound, FinalRoundQuestion, Question, Answer])], // Pastikan ini ada
  providers: [GamesService],
  controllers: [GamesController],
})
export class GamesModule {}
