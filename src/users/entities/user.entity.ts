

import { ApiProperty } from "@nestjs/swagger";
import { Project } from "src/projects/entities/project.entity";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm"

@Entity({name: 'users'})
export class Users {
    @ApiProperty({example: "1", description: "Unique ID for User"})
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({example: "example@gmail.com", description: "Email address of User"})
    @Column({ unique:true, nullable:false})
    email!: string;
    
    @ApiProperty({example: "1234", description: "Password of User"})
    @Column({ type: "varchar", nullable:false})
    password!: string;

    @ApiProperty({example: "Mike", description: "First name of User"})
    @Column({ type: "varchar", length: 100 })
    firstname!: string;

    @ApiProperty({example: "Anderson", description: "Last name of User"})
    @Column({ type: "varchar", length: 100 })
    lastname!: string;   
    
    @OneToMany(()=> Project, (project) => project.user, {
        cascade: true,
    } )
    projects: Project[]    
}
