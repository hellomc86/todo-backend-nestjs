import { ApiProperty } from "@nestjs/swagger";

//For login we don't implement validation
export class loginUserDto {
    @ApiProperty({example: 'user@mail.ru', description: 'Почта'})
    email: string;
    
    @ApiProperty({example: '12345', description: 'пароль'})
    password: string;    
}
