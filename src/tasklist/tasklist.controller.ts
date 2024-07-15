import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TasklistService } from './tasklist.service';
import { CreateTasklistDto } from './dto/create-tasklist.dto';
import { UpdateTasklistDto } from './dto/update-tasklist.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OwnerGuard } from 'src/auth/owner-guard';
import { TaskListOrderListDto } from './dto/tasklist-orderlist.dto';
import { Tasklist } from './entities/tasklist.entity';

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
  @ApiOperation({ summary: "Create a TaskList in Project given by id" })
  @ApiResponse({ status: 200, type: Tasklist })  
  @Post()
  create(@Body() createTasklistDto: CreateTasklistDto, @Param('id') projectid:string) {
    return this.tasklistService.create(createTasklistDto, +projectid);
  }

  @UseGuards(OwnerGuard)
  @ApiOperation({ summary: "get all tasklists in Project given by id" })
  @ApiResponse({ status: 200, type: [Tasklist] })  
  @Get()
  findAll(@Param('id') projectid:string) {
    return this.tasklistService.findAllOrderBy(+projectid);
  }

  @UseGuards(OwnerGuard)
  @ApiOperation({ summary: "Get a tasklist given by listid in Project given by id" })
  @ApiResponse({ status: 200, type: Tasklist })   
  @Get(':listid')
  findOne(@Param('listid') id: string, @Param('id') projectid:string) {
    return this.tasklistService.findOneTaskRelations(+id, +projectid);
  }

  @UseGuards(OwnerGuard)
  @ApiOperation({ summary: "update a tasklist given by listid in Project given by id" })
  @ApiResponse({ status: 200, type: Tasklist })   
  @Patch(':listid')
  update(@Param('listid') id: string, @Param('id') projectid:string, @Body() updateTasklistDto: UpdateTasklistDto) {
    return this.tasklistService.update(+id, updateTasklistDto, +projectid);
  }  

  @UseGuards(OwnerGuard)
  @ApiOperation({ summary: "Delete a tasklist given by listid in Project given by id" })
  @ApiResponse({ status: 200, type: String })  
  @Delete(':listid')
  remove(@Param('listid') id: string, @Param('id') projectid:string) {
    return this.tasklistService.remove(+id, +projectid);
  }
  
  @UseGuards(OwnerGuard)
  @ApiOperation({ summary: "Update order  numbers of tasklists in Project given by id" })
  @ApiResponse({ status: 200, type: String })  
  @Post('/editordernumber')
  changeOrderNumberMultiple(@Body() taskListOrderDto: TaskListOrderListDto, @Param('id') projectid:string) {
    return this.tasklistService.changeOrderNumbermultiple( taskListOrderDto, +projectid);
  }
}
