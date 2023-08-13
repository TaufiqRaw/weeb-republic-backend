import {
  AbilityBuilder,
  ExtractSubjectType,
  InferSubjects,
  PureAbility,
  AbilityTuple,
  MatchConditions,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from 'src/authentication/interfaces/jwt-payload.interface';
import { Media } from 'src/media/entities/media.entity';
import { User } from 'src/user/user.entity';

//Valid Subjects
type Subjects = InferSubjects<typeof User | typeof Media> | 'all';

type CRUD = 'manage' | 'create' | 'read' | 'update' | 'delete';

//[dependent actions of, Valid Subjects]
type Abilities =
  | [CRUD, InferSubjects<typeof User> | 'all']
  | [CRUD, InferSubjects<typeof Media>];

type AppAbility = PureAbility<AbilityTuple, MatchConditions>;
const lambdaMatcher = (matchConditions: MatchConditions) => matchConditions;

//TODO:make better type validation than this
export interface RequiredRule {
  action: Abilities[0];
  subject: Abilities[1];
  fields?: string[];
}

@Injectable()
export class AbilityFactory {
  defineAbility(user: JwtPayload) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(PureAbility);

    if (user.isAdmin) {
      can('manage', 'all');
    } else {
      can('manage', User, ({ id }) => id === user.sub);
      can('manage', Media, ({ submittedBy }) =>
        submittedBy ? submittedBy.id === user.sub : false,
      );
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
      conditionsMatcher: lambdaMatcher,
    });
  }
}
