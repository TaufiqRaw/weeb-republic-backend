import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { BaseService } from "src/common/providers/base.service";
import { User, UserProps } from "./user.entity";
import bcrypt from 'bcrypt';
import { BCRYPT_SALT_ROUNDS } from "./constant";

export class UserService extends BaseService<User, UserProps>{
  constructor(
    @InjectRepository(User)
    private readonly userRepository : EntityRepository<User>,
    private readonly em : EntityManager
  ){
    super(userRepository)
  }

  async create(constructorType: UserProps): Promise<void> {
    const {password : _password, ...user} = constructorType; 
    const password = await bcrypt.hash(_password, BCRYPT_SALT_ROUNDS);
    const newUser = new User({...user, password});
    return await this.em.persistAndFlush(newUser);
  }

  async setter(entity: User, _setAttr: Partial<UserProps>): Promise<void> {
    const {password, ...setAttr} = _setAttr 

    if(typeof password !== 'undefined' && password != '')
      entity.password = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    super.setter(entity, setAttr)
  }

  async findByEmail(email:string):Promise<User | null>{
    const o = await this.userRepository.findOne({email});
    return o;
  }

}