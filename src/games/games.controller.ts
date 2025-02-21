import { Controller, Get, Post, Param, Body, Put, Delete } from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';

@Controller('games')
export class GamesController {
    constructor(private readonly gamesService: GamesService) {}

    // Get all games with related rounds and final rounds
    @Get()
    async findAll(): Promise<Game[]> {
        return this.gamesService.findAll();
    }

    // Get a specific game by ID
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Game> {
        return this.gamesService.findOne(id);
    }

    // Create a new game
    @Post()
    async create(@Body() createGameDto: CreateGameDto): Promise<Game> {
        return this.gamesService.create(createGameDto);
    }

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
}
