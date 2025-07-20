import {
    IsOptional,
    IsString,
    IsNumber,
    IsBoolean,
    IsArray,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateAnswerDto {
    @IsOptional()
    id?: number;

    @IsString()
    answer: string;

    @IsNumber()
    poin: number;

    @IsBoolean()
    isSurprise: boolean;
}

export class UpdateQuestionDto {
    @IsString()
    question: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateAnswerDto)
    answers: UpdateAnswerDto[];
}
