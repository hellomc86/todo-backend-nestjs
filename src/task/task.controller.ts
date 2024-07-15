import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { OwnerGuard } from 'src/auth/owner-guard';
import { MoveTaskToTasklistDto } from './dto/moveTaskToTaskList.dto';

@ApiTags('Task')
@ApiParam({
  name: 'id',
  description: 'Gets the Project id',
})
@ApiParam({
  name: 'listid',
  description: 'Gets the TaskList id',
})

@Controller('projects/:id/tasklist/:listid/task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(OwnerGuard)
  @Post()
  create(@Body() createTaskDto: CreateTaskDto,  @Param('id') projectid:string, @Param('listid') listid:string) {
    return this.taskService.create(createTaskDto,  +projectid, +listid);
  }

  @UseGuards(OwnerGuard)
  @Get()
  findAll(@Param('id') projectid:string, @Param('listid') listid:string) {
    return this.taskService.findAll( +projectid, +listid);
  }

  @UseGuards(OwnerGuard)
  @Get(':taskid')
  findOne(@Param('taskid') taskid: string, @Param('id') projectid:string, @Param('listid') listid:string) {
    return this.taskService.findOne(+taskid, +projectid, +listid);
  }

  @UseGuards(OwnerGuard)
  @Patch(':taskid')
  update(@Param('taskid') taskid: string, @Param('id') projectid:string, @Param('listid') listid:string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(+taskid, +projectid, +listid, updateTaskDto);
  }

  @UseGuards(OwnerGuard)
  @Post(':taskid')
  moveTaskToTasklist(@Param('taskid') taskid: string, @Param('id') projectid:string, @Param('listid') listid:string, @Body() moveTaskToTasklistDto: MoveTaskToTasklistDto) {
    return this.taskService.moveToTaskList(+taskid, +projectid, +listid, moveTaskToTasklistDto);
  }

  @UseGuards(OwnerGuard)
  @Delete(':taskid')
  remove(@Param('taskid') taskid: string,  @Param('id') projectid:string, @Param('listid') listid:string) {
    return this.taskService.remove(+taskid, +projectid, +listid);
  }
}
