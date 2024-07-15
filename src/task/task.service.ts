import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { Between, MoreThan, Repository } from 'typeorm';
import { TasklistService } from 'src/tasklist/tasklist.service';
import { InjectRepository } from '@nestjs/typeorm';
import { MoveTaskToTasklistDto } from './dto/moveTaskToTaskList.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly tasklistService: TasklistService,
  ) { }

  async create(createTaskDto: CreateTaskDto, projectId: number, taskListId: number) {
    const tasklist = await this.tasklistService.findOne(projectId, taskListId);

    await this.updateOrdersBeforeCreate(projectId, taskListId, createTaskDto.taskorder - 1);

    const task = await this.taskRepository.create(createTaskDto);

    task.tasklist = tasklist;

    return await this.taskRepository.save(task);
  }

  async findAll(projectId: number, taskListId: number) {
    return await this.taskRepository.find({
      where: {
        tasklist: {
          project: { id: projectId },
          id: taskListId,
        }
      },
      order: {
        taskorder: "ASC"
      }
    })
  }

  async findOne(id: number, projectId: number, taskListId: number) {
    try {
      const task = await this.taskRepository.find({
        where: {
          tasklist: {
            project: { id: projectId },
            id: taskListId,
          },
          id: id,
        },
      });
      if (task.length < 1) throw new HttpException("Task not found", HttpStatus.NOT_FOUND);

      return task[0];
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.NOT_FOUND);
    }
  }

  async update(id: number, projectId: number, taskListId: number, updateTaskDto: UpdateTaskDto) {
    let task = await this.findOne(id, projectId, taskListId);

    if (updateTaskDto.taskorder !== undefined) {
      await this.changeOrderNumberBeforeUpdate(task, updateTaskDto, projectId, taskListId);
    }
    task = { ...task, ...updateTaskDto };
    return await this.taskRepository.save(task);

  }

  async remove(id: number, projectId: number, taskListId: number) {
    const task = await this.findOne(id, projectId, taskListId);
    await this.updateOrdersBeforeDelete(projectId, taskListId, task.taskorder - 1);
    return await this.taskRepository.delete(id);
  }

  async moveToTaskList(id: number, projectId: number, taskListId: number, moveTaskToTasklistDto: MoveTaskToTasklistDto) {
    let task = await this.findOne(id, projectId, taskListId);

    if (moveTaskToTasklistDto.tasklistid !== undefined && moveTaskToTasklistDto.taskorder !== undefined) {
      await this.updateOrdersBeforeDelete(projectId, taskListId, task.taskorder - 1);
      await this.updateOrdersBeforeCreate(projectId, moveTaskToTasklistDto.tasklistid, moveTaskToTasklistDto.taskorder - 1);
      const taslklist = await this.tasklistService.findOne(moveTaskToTasklistDto.tasklistid, projectId);
      task.tasklist = taslklist
      task.taskorder = moveTaskToTasklistDto.taskorder;
      return await this.taskRepository.save(task);
    }
  }

  private async updateOrdersBeforeCreate(projectId: number, taskListId: number, orderNum: number) {
    const task = await this.getTasksWithGreaterOrderNumber(projectId, taskListId, orderNum);
    if (task.length > 0) {
      const updatedTasklist = task.map(taskL => { taskL.taskorder++; return taskL; })
      await this.taskRepository.save(updatedTasklist);
    }
  }

  private async updateOrdersBeforeDelete(projectId: number, taskListId: number, orderNum: number) {
    const task = await this.getTasksWithGreaterOrderNumber(projectId, taskListId, orderNum);
    if (task.length > 0) {
      const updatedTask = task.map(taskL => { taskL.taskorder--; return taskL; })
      await this.taskRepository.save(updatedTask);
    }
  }

  private async getTasksWithGreaterOrderNumber(projectId: number, taskListId: number, orderNumber: number) {
    return await this.taskRepository.find({
      where: {
        tasklist: {
          id: taskListId,
          project: { id: projectId },
        },
        taskorder: MoreThan(orderNumber)
      }
    });
  }

  async changeOrderNumberBeforeUpdate(task: Task, updateTaskDto: UpdateTaskDto, projectId: number, taskListId: number) {
    if (task.taskorder > updateTaskDto.taskorder)
      await this.updateOrdersToUp(projectId, taskListId, updateTaskDto.taskorder, task.taskorder - 1);
    else if (task.taskorder < updateTaskDto.taskorder)
      await this.updateOrdersToDown(projectId, taskListId, task.taskorder + 1, updateTaskDto.taskorder);
  }

  private async updateOrdersToDown(projectId: number, taskListId: number, orderNumberMin: number, orderNumberMax: number) {
    const tasks = await this.getTasksWithRangeOfOrderNumber(projectId, taskListId, orderNumberMin, orderNumberMax);
    if (tasks.length > 0) {
      const updatedTasks = tasks.map(taskL => { taskL.taskorder--; return taskL; })
      await this.taskRepository.save(updatedTasks);
    }
  }

  private async updateOrdersToUp(projectId: number, taskListId: number, orderNumberMin: number, orderNumberMax: number) {
    const tasks = await this.getTasksWithRangeOfOrderNumber(projectId, taskListId, orderNumberMin, orderNumberMax);
    if (tasks.length > 0) {
      const updatedTasks = tasks.map(taskL => { taskL.taskorder++; return taskL; })
      await this.taskRepository.save(updatedTasks);
    }
  }

  private async getTasksWithRangeOfOrderNumber(projectId: number, taskListId: number, orderNumberMin: number, orderNumberMax: number) {
    return await this.taskRepository.find({
      where: {
        tasklist: {
          id: taskListId,
          project: { id: projectId },
        },
        taskorder: Between(orderNumberMin, orderNumberMax)
      }
    });
  }



  /* 
    
    async update(id: number, updateTasklistDto: UpdateTasklistDto, projectId: number) {
     
        const tasklist = await this.findOne(id, projectId);
     
        if (updateTasklistDto.tasklistorder) {
          await this.changeOrderNumberBeforeUpdate(tasklist, updateTasklistDto, projectId);
          tasklist.tasklistorder = updateTasklistDto.tasklistorder;
        }
        tasklist.tasklistname = updateTasklistDto.tasklistname;
        return await this.tasklistRepository.save(tasklist);
     
    }
  
    
    async changeOrderNumbermultiple(taskListOrderListDto: TaskListOrderListDto, projectId: number) {
      const tasklists = await this.tasklistRepository.find({
        where: {
          project: { id: projectId },
          id: In(taskListOrderListDto.tasklistorderlist),
        }
      });
  
      const updatedTasklist = taskListOrderListDto.tasklistorderlist.map(
        (id, index) => {
          const aTaskL = tasklists.find(taskL => taskL.id == id);
          aTaskL.tasklistorder = index;
          return aTaskL;
        })
      await this.tasklistRepository.save(updatedTasklist);
    }
  
   
    async changeOrderNumberBeforeUpdate(tasklist: Tasklist, updateTasklistDto: UpdateTasklistDto, projectId: number) {
      if (tasklist.tasklistorder > updateTasklistDto.tasklistorder)
        await this.updateOrdersToUp(projectId, updateTasklistDto.tasklistorder, tasklist.tasklistorder - 1);
      else if (tasklist.tasklistorder < updateTasklistDto.tasklistorder)
        await this.updateOrdersToDown(projectId, tasklist.tasklistorder + 1, updateTasklistDto.tasklistorder);
    }
   
    private async updateOrdersToDown(projectId: number, orderNumberMin: number, orderNumberMax: number) {
      const tasklist = await this.getTaskListsWithRangeOfOrderNumber(projectId, orderNumberMin, orderNumberMax);
      const updatedTasklist = tasklist.map(taskL => { taskL.tasklistorder--; return taskL; })
      await this.tasklistRepository.save(updatedTasklist);
    }
  
    private async updateOrdersToUp(projectId: number, orderNumberMin: number, orderNumberMax: number) {
      const tasklist = await this.getTaskListsWithRangeOfOrderNumber(projectId, orderNumberMin, orderNumberMax);
      const updatedTasklist = tasklist.map(taskL => { taskL.tasklistorder++; return taskL; })
      await this.tasklistRepository.save(updatedTasklist);
    }
  
    private async getTaskListsWithRangeOfOrderNumber(projectId: number, orderNumberMin: number, orderNumberMax: number){
      return await this.tasklistRepository.find({
        where: {
          project: { id: projectId },
          tasklistorder: Between(orderNumberMin, orderNumberMax)
        }
      });
    } */
}
