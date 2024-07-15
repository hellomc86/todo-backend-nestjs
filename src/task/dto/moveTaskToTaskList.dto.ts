import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class MoveTaskToTasklistDto {        
    @ApiProperty({example: "1", description: "order number of Task"})    
    @IsNumber({}, {message: "Должно быть числом"})    
    taskorder:number;
   
    @ApiProperty({example: "1", description: "destination Tasklist id number"})    
    @IsNumber({}, {message: "Должно быть числом"})    
    tasklistid:number;   
}
