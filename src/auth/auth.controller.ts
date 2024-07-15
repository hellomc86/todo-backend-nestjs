import {Body, Controller, Post} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {CreateUserDto} from "../users/dto/create-user.dto";
import {AuthService} from "./auth.service";
import { loginUserDto } from 'src/users/dto/login-user.dto';
import { Users } from 'src/users/entities/user.entity';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @ApiOperation({summary: "User Login"})
    @ApiResponse({status:200, type:String})
    @Post('/login')
    login(@Body() loginDto: loginUserDto) {
        return this.authService.login(loginDto)
    }
    
    @ApiOperation({summary: "Create User"})
    @ApiResponse({status:200, type:Users})
    @Post('/registration')
    registration(@Body() userDto: CreateUserDto) {        
        return this.authService.registration(userDto)
    }
}
