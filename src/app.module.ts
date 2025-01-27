import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsModule } from './items/items.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            // port: parseInt(process.env.DB_PORT, 10) || 5432,
            port: parseInt(process.env.DB_PORT || '5433', 10),
            username: process.env.DB_USERNAME || 'postgres',
            password: process.env.DB_PASSWORD || 'johansen123',
            database: process.env.DB_NAME || 'family',
            autoLoadEntities: true,
            synchronize: true, 
        }),
        ItemsModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
