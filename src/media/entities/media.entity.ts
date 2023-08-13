import { Entity, Index, ManyToOne, Property, Ref, Unique} from "@mikro-orm/core"
import { CustomBaseEntity } from "src/common/entities/custom-base.entity"
import { User } from "src/user/user.entity"

export interface MediaProps extends Omit<Media, keyof CustomBaseEntity>{}

@Entity()
export class Media extends CustomBaseEntity{
    @Property()
    @Index()
    original_name : string

    @Property()
    @Unique()
    file_name : string

    @Property()
    mime_type : string

    @Property()
    thumbnail_generated = false

    @ManyToOne({ onDelete: 'set null',nullable:true, onUpdateIntegrity: 'cascade' })
    submittedBy?: Ref<User>

    constructor(
        {file_name,mime_type,original_name,thumbnail_generated = false, submittedBy} 
        : MediaProps,
        ){
        super();
        this.file_name = file_name;
        this.original_name = original_name;
        this.mime_type = mime_type;
        this.thumbnail_generated = thumbnail_generated;
        this.submittedBy = submittedBy;
    }
}