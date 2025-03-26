import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.entity';
import { NotFoundException } from '@nestjs/common';

@Controller('tasks')
export class TaskController {
    constructor(private readonly taskService: TaskService) { }

    @Post()
    create(@Body() createTaskDto: Partial<Task>): Promise<Task> {
        return this.taskService.create(createTaskDto);
    }

    @Get()
    findAll(): Promise<Task[]> {
        return this.taskService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Task> {
        const task = await this.taskService.findOne(id);
        if (!task) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
        return task;
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateTaskDto: Partial<Task>): Promise<Task> {
        const task = await this.taskService.update(id, updateTaskDto);
        if (!task) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
        return task;
    }

    @Delete(':id')
    remove(@Param('id') id: string): Promise<void> {
        return this.taskService.remove(id);
    }
}