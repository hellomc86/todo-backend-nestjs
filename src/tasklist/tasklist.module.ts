import { forwardRef, Module } from '@nestjs/common';
import { TasklistService } from './tasklist.service';
import { TasklistController } from './tasklist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tasklist } from './entities/tasklist.entity';
import { ProjectsModule } from 'src/projects/projects.module';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Tasklist]),
  forwardRef(()=> AuthModule),
  UsersModule,
  ProjectsModule,
],
  controllers: [TasklistController],
  providers: [TasklistService],
  exports: [TasklistService],
})
export class TasklistModule {}
