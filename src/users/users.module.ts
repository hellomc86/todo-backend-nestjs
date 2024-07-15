import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Users]),
  forwardRef(()=> AuthModule),
  
  
],
  controllers: [],
  providers: [UsersService],
  exports: [
    UsersService,
  ]
})
export class UsersModule { }
