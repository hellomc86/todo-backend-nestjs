import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTasklistDto } from './dto/create-tasklist.dto';
import { UpdateTasklistDto } from './dto/update-tasklist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tasklist } from './entities/tasklist.entity';
import { Between, In, MoreThan, Repository } from 'typeorm';
import { ProjectsService } from 'src/projects/projects.service';
import { TaskListOrderListDto } from './dto/tasklist-orderlist.dto';



@Injectable()
export class TasklistService {
  constructor(
    @InjectRepository(Tasklist)
    private readonly tasklistRepository: Repository<Tasklist>,
    private readonly projectService: ProjectsService,
  ) { }

  async create(createTasklistDto: CreateTasklistDto, projectId: number) {
    await this.updateOrdersBeforeCreate(projectId, createTasklistDto.tasklistorder - 1);
    const tasklist = await this.tasklistRepository.create(createTasklistDto);
    const project = await this.projectService.getProject(projectId);
    tasklist.project = project;

    return await this.tasklistRepository.save(tasklist);
  }

  async findAll(projectId: number) {
    return await this.tasklistRepository.find({
      where: { project: { id: projectId } },
    })
  }

  async findAllOrderBy(projectId: number) {
    return await this.tasklistRepository.find({
      where: { project: { id: projectId } },
      order: {
        tasklistorder: "ASC",
        tasks: { taskorder: "ASC" }
      },
      relations: {
        tasks: true
      },
    })
  }

  async findOneTaskRelations(id: number, projectId: number) {
    try {
      const tasklist = await this.tasklistRepository.find({
        where: {
          project: { id: projectId },
          id
        },
        relations: {
          tasks: true
        },
        order: {
          tasks: { taskorder: "ASC" }
        }
      })
      if (tasklist.length < 1) throw new HttpException("TaskList not found", HttpStatus.NOT_FOUND);

      return tasklist[0];
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.NOT_FOUND);
    }
  }


  async findOne(id: number, projectId: number) {
    try {
      const tasklist = await this.tasklistRepository.find({
        where: {
          project: { id: projectId },
          id
        }
      })
      if (tasklist.length < 1) throw new HttpException("TaskList not found", HttpStatus.NOT_FOUND);

      return tasklist[0];
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.NOT_FOUND);
    }
  }

  async update(id: number, updateTasklistDto: UpdateTasklistDto, projectId: number) {

    const tasklist = await this.findOne(id, projectId);

    if (updateTasklistDto.tasklistorder !== undefined) {
      await this.changeOrderNumberBeforeUpdate(tasklist, updateTasklistDto, projectId);
      tasklist.tasklistorder = updateTasklistDto.tasklistorder;
    }
    tasklist.tasklistname = updateTasklistDto.tasklistname;
    return await this.tasklistRepository.save(tasklist);

  }

  async remove(id: number, projectId: number) {
    const tasklist = await this.findOne(id, projectId);
    await this.updateOrdersBeforeDelete(tasklist.tasklistorder, projectId);
    return await this.tasklistRepository.delete(id);
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

  private async updateOrdersBeforeCreate(projectId: number, orderNum: number) {
    const tasklist = await this.getTaskListsWithGreaterOrderNumber(projectId, orderNum);
    if (tasklist.length > 0) {
      const updatedTasklist = tasklist.map(taskL => { taskL.tasklistorder++; return taskL; })
      await this.tasklistRepository.save(updatedTasklist);
    }    
  }

  private async updateOrdersBeforeDelete(projectId: number, orderNum: number) {
    const tasklist = await this.getTaskListsWithGreaterOrderNumber(projectId, orderNum);
    if (tasklist.length > 0) {
      const updatedTasklist = tasklist.map(taskL => { taskL.tasklistorder--; return taskL; })
      await this.tasklistRepository.save(updatedTasklist);
    }
  }

  private async getTaskListsWithGreaterOrderNumber(projectId: number, orderNumber: number) {
    return await this.tasklistRepository.find({
      where: {
        project: { id: projectId },
        tasklistorder: MoreThan(orderNumber)
      }
    });
  }

  async changeOrderNumberBeforeUpdate(tasklist: Tasklist, updateTasklistDto: UpdateTasklistDto, projectId: number) {
    if (tasklist.tasklistorder > updateTasklistDto.tasklistorder)
      await this.updateOrdersToUp(projectId, updateTasklistDto.tasklistorder, tasklist.tasklistorder - 1);
    else if (tasklist.tasklistorder < updateTasklistDto.tasklistorder)
      await this.updateOrdersToDown(projectId, tasklist.tasklistorder + 1, updateTasklistDto.tasklistorder);
  }

  private async updateOrdersToDown(projectId: number, orderNumberMin: number, orderNumberMax: number) {
    const tasklist = await this.getTaskListsWithRangeOfOrderNumber(projectId, orderNumberMin, orderNumberMax);
    if (tasklist.length > 0) {
      const updatedTasklist = tasklist.map(taskL => { taskL.tasklistorder--; return taskL; })
      await this.tasklistRepository.save(updatedTasklist);
    }    
  }

  private async updateOrdersToUp(projectId: number, orderNumberMin: number, orderNumberMax: number) {
    const tasklist = await this.getTaskListsWithRangeOfOrderNumber(projectId, orderNumberMin, orderNumberMax);
    if (tasklist.length > 0) {
      const updatedTasklist = tasklist.map(taskL => { taskL.tasklistorder++; return taskL; })
      await this.tasklistRepository.save(updatedTasklist);
    }    
  }

  private async getTaskListsWithRangeOfOrderNumber(projectId: number, orderNumberMin: number, orderNumberMax: number) {
    return await this.tasklistRepository.find({
      where: {
        project: { id: projectId },
        tasklistorder: Between(orderNumberMin, orderNumberMax)
      }
    });
  }

}
