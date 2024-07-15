import { Tasklist } from "src/tasklist/entities/tasklist.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'tasks'})
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable:false})
    taskorder:number;
    
    @Column({ nullable:false})
    taskname: string;
    
    @Column({ nullable:true})
    description: string;

    @CreateDateColumn()
    created: Date; 
    
    @ManyToOne(()=> Tasklist, (tasklist) => tasklist.tasks, {
        onDelete: 'CASCADE',
    } )
    tasklist: Tasklist
}
