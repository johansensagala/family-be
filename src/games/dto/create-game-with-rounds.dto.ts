// src/games/dto/create-game-with-rounds.dto.ts

import { IsNotEmpty, IsString, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

class CreateAnswerDto {
  @IsString()
  answer: string;

  poin: number;

  isSurprise: boolean;
}

class CreateQuestionDto {
  @IsString()
  question: string;

  @ValidateNested({ each: true })
  @Type(() => CreateAnswerDto)
  answers: CreateAnswerDto[];
}

class CreateRoundDto {
  @IsString()
  type: string;

  @ValidateNested()
  @Type(() => CreateQuestionDto)
  question: CreateQuestionDto;
}

export class CreateGameWithRoundsDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @ValidateNested({ each: true })
  @Type(() => CreateRoundDto)
  @ArrayMinSize(1)
  rounds: CreateRoundDto[];
}
