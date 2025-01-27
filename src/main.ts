import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Mengaktifkan CORS
  await app.listen(5000); // Pastikan backend berjalan di port yang benar
}
bootstrap();
