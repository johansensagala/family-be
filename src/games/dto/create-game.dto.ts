// create-game.dto.ts
export class CreateRoundInput {
    type: 'SINGLE' | 'DOUBLE';
    questionId: number;
}

export class CreateGameDto {
    name: string;
    rounds: CreateRoundInput[];
}
