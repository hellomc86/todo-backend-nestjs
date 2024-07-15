import { ApiProperty } from "@nestjs/swagger";

export class TaskListOrderListDto {    
    @ApiProperty({example: "[1,2]", description: "new ordered id numbers of Tasklists"})
    tasklistorderlist: number[];    
}
