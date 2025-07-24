import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGameDto } from './dto/create-game.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Answer } from './entities/answer.entity';
import { Game } from './entities/game.entity';
import { Question } from './entities/question.entity';
import { Round } from './entities/round.entity';

@Injectable()
export class GamesService {

    constructor(
        @InjectRepository(Game)       private readonly gameRepository: Repository<Game>,
        @InjectRepository(Question)   private readonly questionRepository: Repository<Question>,
        @InjectRepository(Answer)     private readonly answerRepository: Repository<Answer>,
        @InjectRepository(Round)      private readonly roundRepository: Repository<Round>,
    ) {}


    // Fetch all games with related rounds and final rounds
    async findAll(): Promise<Game[]> {
        return this.gameRepository
            .createQueryBuilder('game')
            .leftJoinAndSelect('game.rounds', 'round')
            .leftJoinAndSelect('round.question', 'question')
            .leftJoinAndSelect('question.answers', 'answer')
            .leftJoinAndSelect('game.finalRounds', 'finalRound')
            .orderBy('game.id', 'ASC')  // Pastikan round tetap diurutkan berdasarkan ID ASC
            .addOrderBy('round.id', 'ASC') // Pastikan pertanyaan juga tetap terurut
            .addOrderBy('question.id', 'ASC') // Pastikan pertanyaan juga tetap terurut
            .addOrderBy('answer.poin', 'DESC', 'NULLS LAST') // Urutkan answers hanya dalam konteks question
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
    // async create(createGameDto: CreateGameDto): Promise<Game> {
    //     const newGame = this.gameRepository.create({
    //         name: createGameDto.name,
    //     });

    //     return this.gameRepository.save(newGame);
    // }

    // Update an existing game by its ID
    async update(id: number, updateGameDto: UpdateGameDto): Promise<Game> {
        const existingGame = await this.gameRepository.findOne({
            where: { id },
            relations: ['rounds'],
        });

        if (!existingGame) {
            throw new NotFoundException(`Game with ID ${id} not found`);
        }

        // Update name jika diberikan
        if (typeof updateGameDto.name === 'string') {
            existingGame.name = updateGameDto.name;
        }

        // Jika ada update untuk rounds, kita hapus dulu rounds lama dan tambahkan yang baru
        if (Array.isArray(updateGameDto.rounds)) {
            // Hapus semua rounds lama
            await this.roundRepository.remove(existingGame.rounds);

            const newRounds: Round[] = [];

            for (const roundInput of updateGameDto.rounds) {
                const question = await this.questionRepository.findOne({
                    where: { id: roundInput.questionId },
                });

                if (!question) {
                    throw new NotFoundException(`Question ID ${roundInput.questionId} not found`);
                }

                const round = this.roundRepository.create({
                    type: roundInput.type,
                    question,
                });

                newRounds.push(round);
            }

            existingGame.rounds = newRounds;
        }

        return this.gameRepository.save(existingGame); // cascading akan menyimpan rounds baru
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

    // Ambil semua pertanyaan beserta jawabannya
    async getAllQuestions(): Promise<Question[]> {
        return this.questionRepository
            .createQueryBuilder('question')
            .leftJoinAndSelect('question.answers', 'answer')
            .orderBy('question.id', 'ASC') // Pastikan pertanyaan juga tetap terurut
            .addOrderBy('answer.poin', 'DESC', 'NULLS LAST') // Urutkan answers hanya dalam konteks question
            .addOrderBy('answer.answer', 'ASC')  // Jika poin sama, urutkan berdasarkan abjad jawaban
            .getMany();
    }

    async getQuestionById(id: number): Promise<Question> {
        const question = await this.questionRepository
            .createQueryBuilder('question')
            .leftJoinAndSelect('question.answers', 'answer')
            .where('question.id = :id', { id })
            .orderBy('answer.poin', 'DESC')
            .addOrderBy('answer.answer', 'ASC')
            .getOne();

        if (!question) {
            throw new NotFoundException(`Pertanyaan dengan ID ${id} tidak ditemukan`);
        }

        return question;
    }

    async updateQuestion(id: number, updateQuestionDto: UpdateQuestionDto): Promise<Question> {
        const question = await this.questionRepository.findOne({
            where: { id },
            relations: ['answers'],
        });

        if (!question) throw new NotFoundException('Question not found');

        console.log(updateQuestionDto);
        question.question = updateQuestionDto.question;

        // Update existing answers or replace them
        question.answers = updateQuestionDto.answers.map((answerDto) => {
            const existing = question.answers.find((a) => a.id === answerDto.id);
            if (existing) {
                existing.answer = answerDto.answer;
                existing.poin = answerDto.poin;
                existing.isSurprise = answerDto.isSurprise;
                return existing;
            } else {
                return this.answerRepository.create(answerDto); // new answer
            }
        });

        return this.questionRepository.save(question);
    }

    async create(createGameDto: CreateGameDto): Promise<Game> {
        const game = this.gameRepository.create({ name: createGameDto.name });

        const rounds: Round[] = [];

        for (const roundInput of createGameDto.rounds) {
            const question = await this.questionRepository.findOne({
                where: { id: roundInput.questionId },
            });

            if (!question) throw new NotFoundException(`Question ID ${roundInput.questionId} not found`);

            const round = this.roundRepository.create({
                type: roundInput.type,
                question,
            });

            rounds.push(round);
        }

        game.rounds = rounds;

        return this.gameRepository.save(game); // cascading akan menyimpan rounds juga
    }

}
