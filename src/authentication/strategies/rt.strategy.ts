import { ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayloadRt } from "../interfaces/jtw-payload-rt.interface";
import { JwtPayload } from "../interfaces/jwt-payload.interface";

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, "jwt-rt"){
  constructor(
    config : ConfigService
  ){
    super({
      jwtFromRequest : ExtractJwt.fromExtractors([
        RtStrategy.extractJwt
      ]),
      ignoreExpiration : false,
      secretOrKey : config.getOrThrow<string>('JWT_REFRESH_TOKEN_SECRET'),
      passReqToCallback : true,
    })
  }

  private static extractJwt(req : Request){
    if(
      req.signedCookies &&
      'refreshToken' in req.signedCookies
    ) {
      return req.signedCookies['refreshToken'];
    }
    return null;
  }

  validate(req: Request, payload: JwtPayload) : JwtPayloadRt {
    const refreshToken = req
      ?.signedCookies['refreshToken'];

    if (!refreshToken) throw new ForbiddenException('Refresh token malformed');

    return {
      ...payload,
      refreshToken : refreshToken,
    };
  }
}