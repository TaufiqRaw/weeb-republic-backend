import { CustomBaseEntity } from "../entities/custom-base.entity";

type EntityWithoutBase<T> = Omit<T, keyof CustomBaseEntity>

export default EntityWithoutBase;