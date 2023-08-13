import { ForbiddenError } from '@casl/ability';
import { wrap } from '@mikro-orm/core';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { CustomBaseEntity } from 'src/common/entities/custom-base.entity';
import { AbilityFactory, RequiredRule } from '../ability.factory';
import { CHECK_ABILITY_ENTITY } from '../decorators/abilities.decorator';
import { JwtPayload } from 'src/authentication/interfaces/jwt-payload.interface';

export abstract class AbilitiesEntityGuard<T extends CustomBaseEntity> implements CanActivate {
  constructor(
    private readonly _reflector : Reflector,
    private readonly _ablityFactory : AbilityFactory
  ){}

  abstract getEntity(request : Request):Promise<T | T[] | null>

  abstract getType():(new (...args: any[]) => T)

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const rulesActions = this._reflector.get<Omit<RequiredRule, 'subject'>[]>(CHECK_ABILITY_ENTITY, context.getHandler()) || null;
    if(!rulesActions)
      return true;

    const req = context.switchToHttp().getRequest<Request>();
    
    if(!req.user)
      return false

    const entity = await this.getEntity(req);

    const ability = this._ablityFactory.defineAbility(req.user as JwtPayload);

    if(!entity && rulesActions[0].action === 'create'){
      try {
        ForbiddenError.from(ability).throwUnlessCan("create", this.getType())
        return true;
      } catch (err) {
        return false;
      }
    } 

    if(!entity)
      return false; //TODO: throw not found instead

    let rules : (Omit<RequiredRule, 'subject'>&{subject : T})[] = []

    for(const rule of rulesActions){
      if(Array.isArray(entity))
        entity.forEach(el=>rules.push({action : rule.action, subject : el}))
      else
        rules.push({action : rule.action, subject : entity})
    }

    try{
      rules.forEach(rule =>
        ForbiddenError.from(ability).throwUnlessCan(rule.action, rule.subject)
      )
      
      return true;
    }catch(err){
      //TODO: add global exception handler to catch forbidenError for custom message
      return false
    }
  }
}
