import { ApiProperty } from "@nestjs/swagger";
import { Project } from "src/projects/entities/project.entity";
import { Task } from "src/task/entities/task.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'tasklist'})
export class Tasklist {
    @ApiProperty({example: "1", description: "Unique ID for TaskList"})
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({example: "1", description: "Order number of tasklist in project"})
    @Column({ nullable:false})
    tasklistorder:number;
    
    @ApiProperty({example: "My First TaskList", description: "name of the tasklist"})
    @Column({ nullable:false})
    tasklistname: string;
    
    @ApiProperty({example: "2024-07-07T09:51:56.633Z", description: "Created date of the tasklist"})
    @CreateDateColumn()
    created: Date; 
    
    @ManyToOne(()=> Project, (project) => project.tasklist, {
        onDelete: 'CASCADE',
    } )
    project: Project

    @OneToMany(()=> Task, (task)=> task.tasklist, {
        cascade: true,
    })
    tasks: Task[]
}
