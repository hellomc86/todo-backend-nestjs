import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from 'src/users/entities/user.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) { }

  async create(createProjectDto: CreateProjectDto, user:Users) {
    const project = await this.projectRepository.create(createProjectDto);
    project.user = user;
    return await this.projectRepository.save(project);
  }

  async findAll(userid:number) {
    return await this.projectRepository.find({
      relations: {tasklist:
        { tasks: true},                
      },
      order: {
        tasklist: { tasklistorder: "ASC",
          tasks: {taskorder: "ASC"}
        }        
      },
      where: {
        user:{ id: userid}
      },      
    });
  }

  async findOne(id: number) {
    return await this.projectRepository.find({
      where: {id },
      relations: {tasklist:{ tasks: true},                
      },
    })    
  }

  async getProject(id: number) {
    return await this.projectRepository.findOneBy({id})    
  }

  async findProjectUserId(projectId: number) {
    return await this.projectRepository.find({
      where: {id:projectId },
      relations: {user:true,                
      },
      select:{
        user:{
          id:true
        }
      }
    })    
  }
 
  async update(id: number, updateProjectDto: UpdateProjectDto) {
    return await this.projectRepository.update(id, updateProjectDto);
  }

  async remove(id: number) {
    return await this.projectRepository.delete(id);
  }
}
