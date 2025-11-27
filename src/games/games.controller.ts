import { Body, Controller, Delete, Get, InternalServerErrorException, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Game } from './entities/game.entity';
import { Question } from './entities/question.entity';
import { GamesService } from './games.service';

@Controller('games')
export class GamesController {
    constructor(private readonly gamesService: GamesService) {}

    // Get all games with related rounds and final rounds
    @Get()
    async findAll(): Promise<Game[]> {
        return this.gamesService.findAll();
    }

    // @Get('questions')
    // async getAllQuestions(): Promise<Question[]> {
    //     return this.gamesService.getAllQuestions();
    // }

    @Get('questions')
    async getAllQuestions(
        @Query('search') search?: string
    ): Promise<Question[]> {
        return this.gamesService.getAllQuestions(search);
    }

    @Get('questions/:id')
    async getQuestionById(@Param('id') id: number): Promise<Question> {
        const question = await this.gamesService.getQuestionById(id);
        if (!question) {
            throw new InternalServerErrorException('Pertanyaan tidak ditemukan');
        }
        return question;
    }

    // Get a specific game by ID
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Game> {
        return this.gamesService.findOne(id);
    }

    // Create a new game
    // @Post()
    // async create(@Body() createGameDto: CreateGameDto): Promise<Game> {
    //     return this.gamesService.create(createGameDto);
    // }

    // Update an existing game by ID
    @Put(':id')
    async update(
        @Param('id') id: number,
        @Body() updateGameDto: UpdateGameDto,
    ): Promise<Game> {
        return this.gamesService.update(id, updateGameDto);
    }

    // Delete a game by ID
    @Delete(':id')
    async remove(@Param('id') id: number): Promise<void> {
        return this.gamesService.remove(id);
    }

    @Post('questions/add')
    async createQuestion(@Body() dto: CreateQuestionDto): Promise<Question> {
        const result = await this.gamesService.createQuestion(dto);

        if (!result) {
            throw new InternalServerErrorException('Gagal membuat pertanyaan');
        }

        return result;
    }

    @Put('questions/:id')
    async updateQuestion(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateQuestionDto: UpdateQuestionDto,
    ): Promise<Question> {
        return this.gamesService.updateQuestion(id, updateQuestionDto);
    }

    @Post()
    async create(@Body() createGameDto: CreateGameDto): Promise<Game> {
        return this.gamesService.create(createGameDto);
    }

    //  random games
    @Post('generate-random')
    async generateRandomGame(): Promise<Game> {
        return this.gamesService.generateRandomGame();
    }

}
