import { SetMetadata } from "@nestjs/common";

export const Public = (b:boolean = true)=>SetMetadata('isPublic', b);