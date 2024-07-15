import { ApiProperty } from "@nestjs/swagger";
import { Tasklist } from "src/tasklist/entities/tasklist.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'tasks'})
export class Task {
    @ApiProperty({example: "1", description: "Unique ID for Task"})
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({example: "1", description: "Order number of task in tasklist"})
    @Column({ nullable:false})
    taskorder:number;

    @ApiProperty({example: "My First Task", description: "name of the task"})    
    @Column({ nullable:false})
    taskname: string;
    
    @ApiProperty({example: "This task is for something", description: "Desceription of current task"})
    @Column({ nullable:true})
    description: string;

    @ApiProperty({example: "2024-07-07T09:51:56.633Z", description: "Created date of the task"})
    @CreateDateColumn()
    created: Date; 
    
    @ManyToOne(()=> Tasklist, (tasklist) => tasklist.tasks, {
        onDelete: 'CASCADE',
    } )
    tasklist: Tasklist
}
