import { Property, Enum } from "@mikro-orm/core";
import { CustomBaseEntity } from "src/common/entities/custom-base.entity";

export class Anime extends CustomBaseEntity {
  @Property()
  title: string;

  @Property()
  episodes ?: number;

  @Property()
  mainPicture ?: string;

  @Enum(()=>AnimeType)
  type: AnimeType

  @Enum(()=>AnimeStatus)
  status: AnimeStatus
}

export enum AnimeType {
  TV = 'TV',
  MOVIE = 'MOVIE',
  OVA = 'OVA',
  ONA = 'ONA',
  SPECIAL = 'SPECIAL',
  UNKNOWN = 'UNKNOWN'
}

export enum AnimeStatus {
  FINISHED = 'FINISHED',
  ONGOING = 'ONGOING',
  UPCOMING = 'UPCOMING',
  UNKNOWN = 'UNKNOWN'
}



// AnimeSeason :
// field | type | nullable
// season	Enum of [SPRING, SUMMER, FALL, WINTER, UNDEFINED]	no
// year	Integer	yes

// Anime :
// field | type | nullable
// sources	URL[]	no
// title	String	no
// type	Enum of [TV, MOVIE, OVA, ONA, SPECIAL, UNKNOWN]	no
// episodes	Integer	no
// status	Enum of [FINISHED, ONGOING, UPCOMING, UNKNOWN]	no
// animeSeason	AnimeSeason	no
// picture	URL	no
// thumbnail	URL	no
// synonyms	String[]	no
// relations	URL[]	no
// tags	String[]	no