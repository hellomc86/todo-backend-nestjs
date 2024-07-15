import { forwardRef, Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { TasklistModule } from 'src/tasklist/tasklist.module';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { ProjectsModule } from 'src/projects/projects.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]),
  forwardRef(()=> AuthModule),
  UsersModule,
  ProjectsModule,
  TasklistModule,
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule { }
