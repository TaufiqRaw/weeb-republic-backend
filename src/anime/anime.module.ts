import { Module } from '@nestjs/common';
import { AnimeSeasonModule } from './anime-season/anime-season.module';
import { AnimeSourceModule } from './anime-source/anime-source.module';
import { AnimeSynonymModule } from './anime-synonym/anime-synonym.module';
import { AnimeRelationModule } from './anime-relation/anime-relation.module';
import { AnimeTagModule } from './anime-tag/anime-tag.module';

@Module({
  imports: [AnimeSeasonModule, AnimeSourceModule, AnimeSynonymModule, AnimeRelationModule, AnimeTagModule]
})
export class AnimeModule {}
