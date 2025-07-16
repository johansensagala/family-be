// src/games/dto/create-question.dto.ts
import { IsString, MinLength, ValidateNested, IsArray, IsBoolean, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

class AnswerDto {
    @IsString()
    @MinLength(1)
    answer: string;

    @IsInt()
    @Min(0)
    poin: number;

    @IsBoolean()
    isSurprise: boolean;
}

export class CreateQuestionDto {
    @IsString()
    @MinLength(1)
    question: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AnswerDto)
    answers: AnswerDto[];
}
