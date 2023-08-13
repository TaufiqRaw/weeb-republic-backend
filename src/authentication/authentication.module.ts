import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { AtStrategy } from './strategies/at.strategy';
import { RtStrategy } from './strategies/rt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { Passport } from 'passport';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports : [
    JwtModule.register({}),
    PassportModule,
    UserModule,
  ],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    AtStrategy,
    RtStrategy,
    LocalStrategy
  ]
})
export class AuthenticationModule {}
