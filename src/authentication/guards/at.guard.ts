import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

@Injectable()
export class AtGuard extends AuthGuard('jwt-at'){
    constructor(
        private readonly reflector : Reflector
    ){
        super();
    }

    handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext, status?: any): TUser {
      const isPublic = this.reflector.getAllAndOverride('isPublic', [
        context.getClass(),
        context.getHandler(),
      ]);

      if (isPublic){
        return user;
      }

      if(err || !user){
        throw err || new UnauthorizedException();
      }

      return user;
    }
}