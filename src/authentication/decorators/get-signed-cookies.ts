import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export const SignedCookie = createParamDecorator(
    (data:string | undefined, context : ExecutionContext)=>{
        const req = context.switchToHttp().getRequest<Request>();
        const signedCookie = req.signedCookies;
        if(data)
            return signedCookie[data];
        return signedCookie;
    }
)