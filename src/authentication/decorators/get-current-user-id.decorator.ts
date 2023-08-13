import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { JwtPayload } from "../interfaces/jwt-payload.interface";

export const GetCurrentUserId = createParamDecorator(
    (_ :undefined, context : ExecutionContext ):number | undefined=>{
        const req = context.switchToHttp().getRequest();
        if(req.user === undefined)
            return undefined;
        const user = req.user as JwtPayload;
            return user.sub;
    }
)