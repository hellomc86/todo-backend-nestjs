import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateTaskDto {        
    @ApiProperty({example: "1", description: "order number of Task"})    
    @IsNumber({}, {message: "Должно быть числом"})    
    taskorder:number;
   
    @ApiProperty({example: "new", description: "name of Task"})
    @IsString({message: 'Должно быть строкой'})
    taskname: string;
    
    @ApiProperty({example: "new", description: "Description of Task"})
    @IsString({message: 'Должно быть строкой'})
    description: string;    
}
