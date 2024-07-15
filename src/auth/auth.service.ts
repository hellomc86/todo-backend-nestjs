import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from "../users/dto/create-user.dto";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs'
import { Users } from "../users/entities/user.entity";
import { loginUserDto } from 'src/users/dto/login-user.dto';

@Injectable()
export class AuthService {

  constructor(private userService: UsersService,
    private jwtService: JwtService) { }

  async login(loginuserDto: loginUserDto) {
    const user = await this.validateUser(loginuserDto)
    
    return this.generateToken(user)
  }

  async registration(userDto: CreateUserDto) {
    const candidate = await this.userService.getUserByEmail(userDto.email);
    
    if (candidate) {
      throw new HttpException('Пользователь с таким email существует', HttpStatus.BAD_REQUEST);
    }
    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const user = await this.userService.create({ ...userDto, password: hashPassword })
    return this.generateToken(user)
  }

  private async generateToken(user: Users) {
    const payload = { email: user.email, id: user.id, firstname: user.firstname, lastname: user.lastname }
    return {
      token: this.jwtService.sign(payload)
    }
  }

  private async validateUser(ginuserDto: loginUserDto) {
    const user = await this.userService.getUserByEmail(ginuserDto.email);
    if (user) {
      const passwordEquals = await bcrypt.compare(ginuserDto.password, user.password);
      if (passwordEquals) {
        return user;
      }
    }
    throw new UnauthorizedException({ message: 'Некорректный емайл или пароль' })
  }
}
