import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateItemDto, UpdateItemDto } from './dto';
import { Item } from './entities/item.entity';

@Injectable()
export class ItemsService {
    constructor(
        @InjectRepository(Item)
        private readonly itemRepository: Repository<Item>,
    ) {}

    findAll(): Promise<Item[]> {
        return this.itemRepository.find();
    }

    async findOne(id: number): Promise<Item> {
        const item = await this.itemRepository.findOne({ where: { id } });
        if (!item) {
            throw new Error('Item not found');
        }
        return item;
    }

	async create(createItemDto: CreateItemDto): Promise<Item> {
		const newItem = this.itemRepository.create(createItemDto);
		return this.itemRepository.save(newItem);
	}
	
	async update(id: number, updateItemDto: UpdateItemDto): Promise<Item> {
		const existingItem = await this.itemRepository.findOne({ where: { id } });
		if (!existingItem) {
			throw new Error('Item not found');
		}
		const updatedItem = Object.assign(existingItem, updateItemDto);
		return this.itemRepository.save(updatedItem);
	}
	
    async remove(id: number): Promise<void> {
        await this.itemRepository.delete(id);
    }
}
