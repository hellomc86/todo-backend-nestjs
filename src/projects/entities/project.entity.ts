import { ApiProperty } from "@nestjs/swagger";
import { Tasklist } from "src/tasklist/entities/tasklist.entity";
import { Users } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'projects'})
export class Project {
    @ApiProperty({example: "1", description: "Unique ID for Project"})
    @PrimaryGeneratedColumn()
    id: number;
    
    @ApiProperty({example: "first Project", description: "Name of Project"})
    @Column({ unique:true, nullable:false})
    projectname: string;
    
    @ApiProperty({example: "This is first Project", description: "Description of Project"})
    @Column({ nullable:true})
    description: string;
        
    @ApiProperty({example: "2024-07-07T09:51:56.633Z", description: "Created date of Project"})
    @CreateDateColumn()
    created: Date; 
    
    @ManyToOne(()=> Users, (user) => user.projects, {
        onDelete: 'CASCADE',
    } )
    user: Users

    @OneToMany(()=> Tasklist, (tasklist)=> tasklist.project, {
        cascade: true,
    })
    tasklist: Tasklist[]
}
