import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Request } from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OwnerGuard } from 'src/auth/owner-guard';
import { Project } from './entities/project.entity';


@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) { }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Create Project" })
  @ApiResponse({ status: 200, type: Project })
  @Post()
  create(@Body() createProjectDto: CreateProjectDto, @Request() req,) {
    return this.projectsService.create(createProjectDto, req.user);
  }


  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get all Projects" })
  @ApiResponse({ status: 200, type: [Project] })
  @Get()
  findAll(@Request() req) {
    return this.projectsService.findAll(req.user.id);
  }

  @UseGuards(OwnerGuard)
  @ApiOperation({ summary: "Get a Project by id" })
  @ApiResponse({ status: 200, type: Project })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(+id);
  }

  @UseGuards(OwnerGuard)
  @ApiOperation({ summary: "Update a Project given by id" })
  @ApiResponse({ status: 200, type: Project })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(+id, updateProjectDto);
  }

  @UseGuards(OwnerGuard)
  @ApiOperation({ summary: "Delete a Project by id" })
  @ApiResponse({ status: 200, type: String })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(+id);
  }
}
