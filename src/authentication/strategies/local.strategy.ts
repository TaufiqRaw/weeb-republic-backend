import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { AuthenticationService } from "../authentication.service";
import { Strategy } from "passport-local";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local'){
  constructor(
      private readonly authService : AuthenticationService
  ){
      super({usernameField: "email"});
  }
  async validate(email:string, password:string): Promise<any>{
      const user = await this.authService.validateUser(email, password);
      if (!user) {
        throw new UnauthorizedException("Email or password is incorrect");
      }
      return user;
  }
}