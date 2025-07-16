import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';
import { Question } from './entities/question.entity';
import { Answer } from './entities/answer.entity';
import { CreateQuestionDto } from './dto/create-question.dto';

@Injectable()
export class GamesService {

    constructor(
        @InjectRepository(Game)       private readonly gameRepository: Repository<Game>,
        @InjectRepository(Question)   private readonly questionRepository: Repository<Question>,
        @InjectRepository(Answer)     private readonly answerRepository: Repository<Answer>,
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
            .addOrderBy('answer.answer', 'ASC')  // Jika poin sama, urutkan berdasarkan abjad jawaban
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
            .addOrderBy('answer.answer', 'ASC')  // Jika poin sama, urutkan berdasarkan abjad jawaban
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

    async createQuestion(dto: CreateQuestionDto): Promise<Question | null> {
        // 1. buat entitas Question
        const question = this.questionRepository.create({ question: dto.question });
        await this.questionRepository.save(question);

        // 2. masukkan setiap Answer
        const answerEntities = dto.answers.map(a =>
            this.answerRepository.create({
                answer: a.answer,
                poin: a.poin,
                isSurprise: a.isSurprise,
                question,                    // relasi many‑to‑one
            }),
        );
        await this.answerRepository.save(answerEntities);

        // 3. kembalikan pertanyaan berikut relasi answers‑nya
        return this.questionRepository.findOne({
            where: { id: question.id },
            relations: ['answers'],
        });
    }
}
