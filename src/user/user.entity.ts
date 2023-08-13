import { Entity, Index, Property, Unique } from "@mikro-orm/core";
import { CustomBaseEntity } from "src/common/entities/custom-base.entity";
import EntityWithoutBase from "src/common/interfaces/entity-without-base.interface";

export interface UserProps extends Omit<EntityWithoutBase<User>, "productionLogs">{}

@Entity()
export class User extends CustomBaseEntity{
    @Property()
    @Index()
    name : string;

    @Property()
    @Unique()
    email : string;
    
    @Property({hidden:true})
    password : string;
    
    @Property()
    isAdmin = false;

    @Property()
    profilePicture? : string; 

    @Property({length:13})
    phone? : string;

    @Property({hidden:true})
    refreshToken ? : string;

    constructor({name,email,isAdmin = false,password, profilePicture, phone}:UserProps){
      super();
      this.name = name,
      this.email = email,
      this.phone = phone,
      this.isAdmin = isAdmin
      this.password = password;
      this.profilePicture = profilePicture;
    }
}