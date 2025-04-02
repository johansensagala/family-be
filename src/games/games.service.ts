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
        return this.gameRepository
            .createQueryBuilder('game')
            .leftJoinAndSelect('game.rounds', 'round')
            .leftJoinAndSelect('round.question', 'question')
            .leftJoinAndSelect('question.answers', 'answer')
            .leftJoinAndSelect('game.finalRounds', 'finalRound')
            .orderBy('round.id', 'ASC')  // Pastikan round tetap diurutkan berdasarkan ID ASC
            .addOrderBy('question.id', 'ASC') // Pastikan pertanyaan juga tetap terurut
            .addOrderBy('answer.point', 'DESC', 'NULLS LAST') // Urutkan answers hanya dalam konteks question
            .getMany();
    }
            
    // Fetch a single game by its ID with related rounds and final rounds
    async findOne(id: number): Promise<Game> {
        const game = await this.gameRepository
            .createQueryBuilder('game')
            .leftJoinAndSelect('game.rounds', 'round')
            .leftJoinAndSelect('round.question', 'question')
            .leftJoinAndSelect('question.answers', 'answer')
            .leftJoinAndSelect('game.finalRounds', 'finalRound')
            .where('game.id = :id', { id })
            .orderBy('round.id', 'ASC') // Pastikan rounds tetap diurutkan berdasarkan ID ASC
            .addOrderBy('question.id', 'ASC') // Menjaga urutan pertanyaan agar tetap sesuai
            .addOrderBy('answer.poin', 'DESC', 'NULLS LAST') // Urutkan answers dalam konteks pertanyaannya
            .getOne();
    
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
