import { createParamDecorator ,ExecutionContext} from "@nestjs/common";
import { Request } from "express";
import { JwtPayloadRt } from "../interfaces/jtw-payload-rt.interface";

export const GetCurrentUser = createParamDecorator(
    (data: keyof JwtPayloadRt | undefined, context: ExecutionContext)=>{
        const req = context.switchToHttp().getRequest();
        if(!data)
            return req.user;
        return req.user[data];
    }
)