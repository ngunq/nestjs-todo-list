import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './task.entity';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class TaskService {
    // private readonly logger = new Logger(TaskService.name);

    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        @InjectModel(Task.name) private taskModel: Model<Task>
    ) { }

    async create(createTaskDto: Partial<Task>): Promise<Task> {
        const task = new this.taskModel(createTaskDto);
        await task.save();
        this.logger.log({
            level: 'info',
            message: 'Task created successfully',
            operation: 'create',
            taskId: task._id,
        });
        return task;
    }

    async findAll(): Promise<Task[]> {
        const tasks = await this.taskModel.find().exec();
        this.logger.log({
            level: 'info',
            message: 'Task retrieved',
            operation: 'read',
            count: tasks.length,
        });
        return tasks;
    }

    async findOne(id: string): Promise<Task | null> {
        const task = await this.taskModel.findById(id).exec();
        if (!task) {
            this.logger.log({
                level: 'error',
                message: 'Task not found',
                operation: 'read',
                taskId: id,
            });
            return null;
        }
        this.logger.log({
            level: 'info',
            message: 'Task retrieved',
            operation: 'read',
            taskId: id,
        });
        return task;
    }

    async update(id: string, updateTaskDto: Partial<Task>): Promise<Task | null> {
        const task = await this.taskModel.findByIdAndUpdate(id, updateTaskDto, { new: true }).exec();
        if (!task) {
            this.logger.log({
                level: 'error',
                message: 'Task not found',
                operation: 'read',
                taskId: id,
            });
            return null;
        }
        this.logger.log({
            level: 'info',
            message: 'Task updated',
            operation: 'update',
            taskId: id,
        });
        return task;
    }

    async remove(id: string): Promise<void> {
        await this.taskModel.findByIdAndDelete(id).exec();
        this.logger.log({
            level: 'info',
            message: 'Task deleted',
            operation: 'delete',
            taskId: id,
        });
    }
}