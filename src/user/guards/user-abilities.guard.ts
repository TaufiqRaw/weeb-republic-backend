import { Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { AbilitiesEntityGuard } from "src/authorization/guards/abilities-entity.guard";
import { User } from "../user.entity";
import { AbilityFactory } from "src/authorization/ability.factory";
import { UserService } from "../user.service";

@Injectable()
export class UserAbilitiesGuard extends AbilitiesEntityGuard<User> {
  constructor(
    private readonly reflector : Reflector,
    private readonly abilityFactory : AbilityFactory,
    private readonly userService : UserService,
  ){
    super(reflector, abilityFactory)
  }

  getType(): new (...args: any[]) => User {
    return User;
  }

  async getEntity(request: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): Promise<User | User[] | null> {
    const id = request.params.id || request.body.ids
    if(!id || (!Array.isArray(id) && !parseInt(id)))
        return null;
    if(Array.isArray(id))
      return await this.userService.find({id: {$in : id}})
    else
      return await this.userService.findOne(parseInt(id));
  }
}