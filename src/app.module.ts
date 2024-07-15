import { Module} from "@nestjs/common";


import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from './users/users.module';
import { ConfigModule } from "@nestjs/config";
import { Users } from "./users/entities/user.entity";
import { ProjectsModule } from './projects/projects.module';
import { TasklistModule } from './tasklist/tasklist.module';
import { TaskModule } from './task/task.module';
import { AuthModule } from './auth/auth.module';


@Module({
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.${process.env.NODE_ENV}.env`
        }),        
        TypeOrmModule.forRoot({            
                type: "postgres",
                host: process.env.POSTGRES_HOST,
                port: Number(process.env.POSTGRES_PORT),
                username: process.env.POSTGRES_USER,
                password: process.env.POSTGRES_PASSWORD,
                database: process.env.POSTGRES_DATABASE,
                entities: [Users],  
                synchronize: Boolean(process.env.POSTGRES_DATABASE_SYNC),              
                autoLoadEntities: true,            
        }),
        UsersModule,
        ProjectsModule,
        TasklistModule,
        TaskModule,
        AuthModule,
        
    ]
})

export class AppModule {}
