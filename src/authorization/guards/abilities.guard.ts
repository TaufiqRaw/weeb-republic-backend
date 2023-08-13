import { ForbiddenError } from '@casl/ability';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AbilityFactory, RequiredRule } from '../ability.factory';
import { CHECK_ABILITY } from '../decorators/abilities.decorator';

@Injectable()
export class AbilitiesGuard implements CanActivate {
  constructor(
    private readonly reflector : Reflector,
    private readonly ablityFactory : AbilityFactory
  ){}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const rules = this.reflector.get<RequiredRule[]>(CHECK_ABILITY, context.getHandler()) || [];

    const {user} = context.switchToHttp().getRequest();
    const ability = this.ablityFactory.defineAbility(user);

    try{
      rules.forEach(rule =>
        //@ts-ignore
        ForbiddenError.from(ability).throwUnlessCan(rule.action, rule.subject)
      )
      return true;
    }catch(err){
      //TODO: add global exception handler to catch forbidenError for custom message
      return false
    }
  }
}
