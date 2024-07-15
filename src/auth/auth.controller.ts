import {Body, Controller, Post} from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";
import {CreateUserDto} from "../users/dto/create-user.dto";
import {AuthService} from "./auth.service";
import { loginUserDto } from 'src/users/dto/login-user.dto';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post('/login')
    login(@Body() loginDto: loginUserDto) {
        return this.authService.login(loginDto)
    }

    @Post('/registration')
    registration(@Body() userDto: CreateUserDto) {
        
        return this.authService.registration(userDto)
    }
}
