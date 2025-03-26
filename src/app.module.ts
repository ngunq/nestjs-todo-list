import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { TaskModule } from './task/task.module';
import { winstonOptions } from "logger.config";

@Module({
  imports: [
    WinstonModule.forRoot(winstonOptions),
    MongooseModule.forRoot('mongodb://mongodb:27017/todo-db'),
    TaskModule,
  ],
})
export class AppModule { }