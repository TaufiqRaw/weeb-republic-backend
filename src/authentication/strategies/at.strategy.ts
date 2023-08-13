import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../interfaces/jwt-payload.interface";

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, "jwt-at"){
  constructor(
    config : ConfigService
  ){
    super({
      jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration : false,
      secretOrKey : config.getOrThrow<string>('JWT_ACCESS_TOKEN_SECRET')
    })
  }

  validate(payload : JwtPayload){
    return {
      userId : payload.sub,
      username : payload.username
    }
  }
  
}