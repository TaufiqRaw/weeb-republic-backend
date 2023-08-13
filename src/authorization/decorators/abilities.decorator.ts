import { SetMetadata } from '@nestjs/common';
import { RequiredRule } from '../ability.factory';

export const CHECK_ABILITY = 'check_ability';
export const CheckAbilities = (...requirements: RequiredRule[]) =>
  SetMetadata(CHECK_ABILITY, requirements);

export const CHECK_ABILITY_ENTITY = 'check_ability_entity';
export const CheckAbilitiesEntity = (
  ...requirements: Omit<RequiredRule, 'subject'>[]
) => SetMetadata(CHECK_ABILITY_ENTITY, requirements);
