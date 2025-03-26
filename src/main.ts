// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { winstonOptions } from "logger.config";

async function bootstrap() {
  const logger = WinstonModule.createLogger(winstonOptions);
  const app = await NestFactory.create(AppModule, { logger });
  await app.listen(3000);
}
bootstrap();