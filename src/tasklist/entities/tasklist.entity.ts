import { Project } from "src/projects/entities/project.entity";
import { Task } from "src/task/entities/task.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'tasklist'})
export class Tasklist {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable:false})
    tasklistorder:number;
    
    @Column({ nullable:false})
    tasklistname: string;
    
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
