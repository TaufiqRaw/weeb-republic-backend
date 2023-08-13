import { EntityName, EventArgs, EventSubscriber } from '@mikro-orm/core';
import { Media } from './media.entity';
import { Inject } from '@nestjs/common';
import { Logger } from 'winston';
import { EntityManager } from '@mikro-orm/postgresql';
import { rm } from 'fs/promises';
import { join } from 'path';
import { USER_IMAGE_PATH } from '../constants';

export class MediaSubscriber implements EventSubscriber<Media> {
  constructor(
    @Inject('winston')
    private readonly logger: Logger,
    private readonly em: EntityManager,
  ) {
    em.getEventManager().registerSubscriber(this);
  }

  getSubscribedEntities(): EntityName<Media>[] {
    return [Media];
  }

  async beforeDelete(args: EventArgs<Media>) {
    const media = args.entity;
    try {
      if (media.thumbnail_generated) {
        const [filename, ext] = media.file_name.split('.');
        await rm(join(USER_IMAGE_PATH, `${filename}-thumb.${ext}`));
      }
      await rm(join(USER_IMAGE_PATH, media.file_name));
    } catch (err) {
      this.logger.error(
        '[Media.subscriber@beforeDelete] file deletion error : ' +
          JSON.stringify(err),
      );
    }
  }
}
