// update-game.dto.ts
import { CreateRoundInput } from './create-game.dto';

export class UpdateGameDto {
    name?: string;
    rounds?: CreateRoundInput[];
}
