import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { Observable } from "rxjs";
import { JwtPayload } from "../interfaces/jwt-payload.interface";

@Injectable()
export default class AdminGuard implements CanActivate {
    constructor(
            private readonly reflector : Reflector
        ){}
    canActivate(ctx: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const user = ctx.switchToHttp().getRequest<Request>().user as JwtPayload;
        const isPublic = this.reflector.getAllAndOverride<boolean,string>('isPublic', [ctx.getClass(), ctx.getHandler()]);
        
        if(isPublic)
            return true;

        return user && user.isAdmin;
    }
}