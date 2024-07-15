import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateTasklistDto {    
    @ApiProperty({example: "new", description: "name of Tasklist"})
    @IsString({message: 'Должно быть строкой'})
    tasklistname: string; 

    @ApiProperty({example: "1", description: "new order number of Tasklist"})    
    @IsNumber({}, {message: "Должно быть числом"})
    tasklistorder: number;       
}
