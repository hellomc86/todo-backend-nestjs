import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TasklistService } from './tasklist.service';
import { CreateTasklistDto } from './dto/create-tasklist.dto';
import { UpdateTasklistDto } from './dto/update-tasklist.dto';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { OwnerGuard } from 'src/auth/owner-guard';
import { TaskListOrderListDto } from './dto/tasklist-orderlist.dto';

@ApiTags('TaskList')
@ApiParam({
  name: 'id',
  description: 'Gets the Project id',
})
@Controller('projects/:id/tasklist')
export class TasklistController {
  constructor(private readonly tasklistService: TasklistService,
    
  ) {}

  @UseGuards(OwnerGuard)
  @Post()
  create(@Body() createTasklistDto: CreateTasklistDto, @Param('id') projectid:string) {
    return this.tasklistService.create(createTasklistDto, +projectid);
  }

  @UseGuards(OwnerGuard)
  @Get()
  findAll(@Param('id') projectid:string) {
    return this.tasklistService.findAllOrderBy(+projectid);
  }

  @UseGuards(OwnerGuard)
  @Get(':listid')
  findOne(@Param('listid') id: string, @Param('id') projectid:string) {
    return this.tasklistService.findOneTaskRelations(+id, +projectid);
  }

  @UseGuards(OwnerGuard)
  @Patch(':listid')
  update(@Param('listid') id: string, @Param('id') projectid:string, @Body() updateTasklistDto: UpdateTasklistDto) {
    return this.tasklistService.update(+id, updateTasklistDto, +projectid);
  }  

  @UseGuards(OwnerGuard)
  @Delete(':listid')
  remove(@Param('listid') id: string, @Param('id') projectid:string) {
    return this.tasklistService.remove(+id, +projectid);
  }
  
  @UseGuards(OwnerGuard)
  @Post('/editordernumber')
  changeOrderNumberMultiple(@Body() taskListOrderDto: TaskListOrderListDto, @Param('id') projectid:string) {
    return this.tasklistService.changeOrderNumbermultiple( taskListOrderDto, +projectid);
  }
}
