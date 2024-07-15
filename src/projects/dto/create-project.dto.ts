import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateProjectDto {
    @ApiProperty({example: "firstproject", description: "name of Project"})
    @IsString({message: 'Должно быть строкой'})
    projectname: string;    
    @ApiProperty({example: "This is project is about schedule", description: "Description of the project"})
    @IsString({message: 'Должно быть строкой'})
    description: string;    
}
