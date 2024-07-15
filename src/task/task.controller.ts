import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OwnerGuard } from 'src/auth/owner-guard';
import { MoveTaskToTasklistDto } from './dto/moveTaskToTaskList.dto';
import { Task } from './entities/task.entity';

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
  @ApiOperation({ summary: "Create a Task in tasklist given by listid in Project given by id" })
  @ApiResponse({ status: 200, type: Task })
  @Post()
  create(@Body() createTaskDto: CreateTaskDto,  @Param('id') projectid:string, @Param('listid') listid:string) {
    return this.taskService.create(createTaskDto,  +projectid, +listid);
  }

  @UseGuards(OwnerGuard)
  @ApiOperation({ summary: "Get all Tasks in tasklist given by listid in Project given by id" })
  @ApiResponse({ status: 200, type: [Task] })
  @Get()
  findAll(@Param('id') projectid:string, @Param('listid') listid:string) {
    return this.taskService.findAll( +projectid, +listid);
  }

  @UseGuards(OwnerGuard)
  @ApiOperation({ summary: "Get a Task by given taskid in tasklist given by listid in Project given by id" })
  @ApiResponse({ status: 200, type: Task }) 
  @Get(':taskid')
  findOne(@Param('taskid') taskid: string, @Param('id') projectid:string, @Param('listid') listid:string) {
    return this.taskService.findOne(+taskid, +projectid, +listid);
  }

  @UseGuards(OwnerGuard)
  @ApiOperation({ summary: "update a Task by given taskid in tasklist given by listid in Project given by id" })
  @ApiResponse({ status: 200, type: Task }) 
  @Patch(':taskid')
  update(@Param('taskid') taskid: string, @Param('id') projectid:string, @Param('listid') listid:string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(+taskid, +projectid, +listid, updateTaskDto);
  }

  @UseGuards(OwnerGuard)
  @ApiOperation({ summary: "move a Task by given taskid to tasklist from tasklist given by listid in Project given by id" })
  @ApiResponse({ status: 200, type: Task }) 
  @Post(':taskid')
  moveTaskToTasklist(@Param('taskid') taskid: string, @Param('id') projectid:string, @Param('listid') listid:string, @Body() moveTaskToTasklistDto: MoveTaskToTasklistDto) {
    return this.taskService.moveToTaskList(+taskid, +projectid, +listid, moveTaskToTasklistDto);
  }

  @UseGuards(OwnerGuard)
  @ApiOperation({ summary: "Delete a Task by given taskid in tasklist given by listid in Project given by id" })
  @ApiResponse({ status: 200, type: String }) 
  @Delete(':taskid')
  remove(@Param('taskid') taskid: string,  @Param('id') projectid:string, @Param('listid') listid:string) {
    return this.taskService.remove(+taskid, +projectid, +listid);
  }
}
