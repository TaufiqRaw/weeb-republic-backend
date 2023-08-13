import { Controller, Get, HttpCode, HttpStatus, Post, Request, Res, UseGuards } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { AuthenticationService } from './authentication.service';
import { Public } from './decorators/public.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RtGuard } from './guards/rt.guard';
import { Response, Request as ExpressRequest } from 'express';
import { GetCurrentUser } from './decorators/get-current-user.decorator';
import { GetCurrentUserId } from './decorators/get-current-user-id.decorator';

@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly authService : AuthenticationService,
  ){}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Request() req:ExpressRequest,
    @Res({ passthrough:true }) response : Response
  ){
    const tokens = await this.authService.login(<Omit<User, 'password'>> req.user);
    response.cookie('refreshToken', tokens.refreshToken, {signed:true, httpOnly:true, maxAge:(1000*60*60*24*7)});
    return tokens.accessToken;
  }

  @Public()
  @UseGuards(RtGuard)
  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @GetCurrentUserId() userId : number, 
    @GetCurrentUser('refreshToken') refreshToken : string,
    @Res({ passthrough:true }) response : Response
  ){
    const tokens = await this.authService.refreshToken(userId, refreshToken);
    response.cookie('refreshToken', tokens.refreshToken, {signed: true, httpOnly:true, maxAge:(1000*60*60*24*7)})
    return tokens.accessToken;
  }
}
