import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule} from '@nestjs/config'
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { join } from 'path';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { AuthenticationModule } from './authentication/authentication.module';
import { UserModule } from './user/user.module';
import { AtGuard } from './authentication/guards/at.guard';
import { MediaModule } from './media/media.module';
import { AuthorizationModule } from './authorization/authorization.module';
import { AnimeModule } from './anime/anime.module';
import AdminGuard from './authentication/guards/admin.guard';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
    MikroOrmModule.forRoot(),
    WinstonModule.forRoot({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({
          dirname: join(__dirname, './../log/'),
          filename: 'debug.log',
          level: 'debug',
        }),
        new winston.transports.File({
          dirname: join(__dirname, './../log/'),
          filename: 'error.log',
          level: 'error',
        }),
        new winston.transports.File({
          dirname: join(__dirname, './../log/'),
          filename: 'info.log',
          level: 'info',
        }),
      ],
    }),
    AuthenticationModule,
    UserModule,
    MediaModule,
    AuthorizationModule,
    AnimeModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide : APP_PIPE,
      useFactory : ()=>{
        return new ValidationPipe({whitelist: true})
      },
    },
    {
      provide : APP_GUARD,
      useClass : AtGuard,
    },
    {
      provide : APP_GUARD,
      useClass : AdminGuard,
    },
  ],
})
export class AppModule {}
