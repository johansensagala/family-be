import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';

@Injectable()
export class GamesService {
    constructor(
        @InjectRepository(Game)
        private readonly gameRepository: Repository<Game>,
    ) {}

    // Fetch all games with related rounds and final rounds
    async findAll(): Promise<Game[]> {
        return this.gameRepository.find({
            relations: ['rounds', 'rounds.question', 'finalRounds', 'rounds.question.answers'],  // Ensure related entities are loaded
        });
    }

    // Fetch a single game by its ID with related rounds and final rounds
    async findOne(id: number): Promise<Game> {
        const game = await this.gameRepository.findOne({
            where: { id },
            relations: ['rounds', 'rounds.question', 'rounds.question.answers', 'finalRounds'], // Load related entities
        });

        if (!game) {
            throw new NotFoundException(`Game with ID ${id} not found`);
        }

        return game;
    }

    // Create a new game
    async create(createGameDto: CreateGameDto): Promise<Game> {
        const newGame = this.gameRepository.create({
            name: createGameDto.name,
        });

        return this.gameRepository.save(newGame);
    }

    // Update an existing game by its ID
    async update(id: number, updateGameDto: UpdateGameDto): Promise<Game> {
        const existingGame = await this.gameRepository.findOne({ where: { id } });

        if (!existingGame) {
            throw new NotFoundException(`Game with ID ${id} not found`);
        }

        // Merging update data with the existing game
        const updatedGame = Object.assign(existingGame, updateGameDto);
        return this.gameRepository.save(updatedGame);
    }

    // Delete a game by its ID
    async remove(id: number): Promise<void> {
        const game = await this.gameRepository.findOne({ where: { id } });

        if (!game) {
            throw new NotFoundException(`Game with ID ${id} not found`);
        }

        await this.gameRepository.delete(id);
    }
}
