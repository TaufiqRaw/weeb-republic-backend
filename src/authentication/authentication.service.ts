import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserProps } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtToken } from './interfaces/jwt-token.interface';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService : UserService,
    private readonly jwtService : JwtService,
    private readonly config : ConfigService,
  ){}

  async validateUser(email : string, password : string):Promise<Omit<User, 'password'> | null>{
    const user = await this.userService.findByEmail(email);
    if(!user)
      return null;
    
    const compareRes = await bcrypt.compare(password, user.password);
    if(compareRes){
      const {password, ...res} = user;
      return res;
    }
    return null;
  }

  async login(user:Omit<User, 'password'>){
    const tokens = await this.getToken(user.id, user.name, user.email, user.isAdmin);
    await this.updateRtHash(user.id, tokens.refreshToken);
    return tokens;
  }

  async refreshToken(userId:number, rt : string){
    const user = await this.userService.findOne(userId);
    if(!user || !user.refreshToken)
        throw new UnauthorizedException('user hasnt sign in');

    const rtMatches = await bcrypt.compare(rt, user.refreshToken);
    if(!rtMatches) throw new UnauthorizedException('invalid refresh token');
    
    const tokens = await this.getToken(user.id, user.name, user.email, user.isAdmin);
    await this.updateRtHash(user.id, tokens.refreshToken);
    
    return tokens;
  }

  async updateRtHash(userId: number, rt: string): Promise<void | never> {
    const foundUser = await this.userService.findOne(userId);
    if(!foundUser)
        throw new UnauthorizedException();
    foundUser.refreshToken = await bcrypt.hash(rt, 10);
    await this.userService.flush()
  }

  private async getToken(userId:number, name:string , email:string, isAdmin: boolean) :Promise<JwtToken> {
    const jwtPayload : JwtPayload = {
      sub: userId,
      username : name,
      email: email,
      isAdmin : isAdmin
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {secret : this.config.getOrThrow<string>('JWT_ACCESS_TOKEN_SECRET'), expiresIn: '15m'}),
      this.jwtService.signAsync(jwtPayload, {secret : this.config.getOrThrow<string>('JWT_REFRESH_TOKEN_SECRET'), expiresIn: '7d'}),
    ]);

    return {
      accessToken: at,
      refreshToken: rt,
    };
  } 
}

