import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";

import {JwtService} from "@nestjs/jwt";
import { ProjectsService } from "src/projects/projects.service";
import { UsersService } from "src/users/users.service";

@Injectable()
export class OwnerGuard implements CanActivate {
    constructor(private jwtService: JwtService,
        private userSevice: UsersService, 
        private projectService: ProjectsService,
    ) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest()
        try {
            const authHeader = req.headers.authorization;
            if(!authHeader) throw new UnauthorizedException({message: 'Пользователь не авторизован'});
            const bearer = authHeader.split(' ')[0]
            const token = authHeader.split(' ')[1]

            if (bearer !== 'Bearer' || !token) {
                throw new UnauthorizedException({message: 'Пользователь не авторизован'})
            }
            
            const user = this.jwtService.verify(token);            
            req.user = user;    
            const projects = await this.projectService.findProjectUserId(req.params.id);    
            if(projects.length < 1) throw new UnauthorizedException({message: 'Project not found or You do not have access to it'});

            return user.id === projects[0].user.id;
            //return true;
        } catch (e) {
            //throw new UnauthorizedException({message: 'Пользователь не авторизован'})
            throw new UnauthorizedException(e.message)
        }
    }

}
