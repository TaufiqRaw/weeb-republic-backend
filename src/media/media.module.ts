import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Media } from './entities/media.entity';
import { MediaService } from './media.service';
import { MediaSubscriber } from './entities/media.entity.subscriber';

@Module({
  imports : [
    MikroOrmModule.forFeature([Media])
  ],
  providers : [MediaService, MediaSubscriber],
  exports : [MediaService]
})
export class MediaModule {}
