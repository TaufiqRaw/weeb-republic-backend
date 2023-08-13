import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from 'src/common/providers/base.service';
import { Media, MediaProps } from './entities/media.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import sharp, { OutputInfo } from 'sharp';
import { join } from 'path';
import { USER_IMAGE_PATH } from './constants';
import { Ref } from '@mikro-orm/core';
import { User } from 'src/user/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { contentType } from 'mime-types';

type storeImageConfigType = {
  isThumbnail?: boolean;
  resize?: {
    width?: number;
    height?: number;
  };
};

interface ConversionOutputInterface extends OutputInfo {
  filename: string;
}

@Injectable()
export class MediaService extends BaseService<Media, MediaProps> {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: EntityRepository<Media>,
    private readonly em: EntityManager,
  ) {
    super(mediaRepository);
  }
  async convertImgAndSave(
    imgBuffer: Buffer,
    _filename: string,
    option?: {
      resize: {
        width?: number;
        height?: number;
      };
    },
  ): Promise<ConversionOutputInterface> {
    const filename = _filename + '.jpg';
    try {
      const o = sharp(imgBuffer);
      const metadata = await o.metadata();

      if (!metadata.width || !metadata.height) {
        throw new Error('Image Metadata Error');
      }

      //resize o if needed and if o.width > resize.width and o.height > resize.height, width and height will do separately
      if (option?.resize) {
        const { width, height } = option.resize;
        if (width && metadata.width > width) o.resize({ width });
        if (height && metadata.height > height) o.resize({ height });
      }

      return {
        ...(await o.jpeg().toFile(join(USER_IMAGE_PATH, filename))),
        filename,
      };
    } catch (err: any) {
      throw err;
    }
  }

  async deleteFileById(id: number) {
    const media = await this.mediaRepository.findOne(id);
    if (!media) throw new NotFoundException();
    try {
      await this.em.removeAndFlush(media);
    } catch (err) {
      throw err;
    }
    return media;
  }

  async create(constructorType: MediaProps): Promise<void> {
    const newMediaInstance = new Media(constructorType);
    await this.em.persistAndFlush(newMediaInstance);
  }

  async storeImage(
    file: Express.Multer.File,
    user: Ref<User>,
    { isThumbnail = false, resize = {} }: storeImageConfigType,
  ) {
    const filename = uuidv4();
    const outputMetadata = await this.convertImgAndSave(file.buffer, filename, {
      resize,
    });

    if (isThumbnail)
      await this.convertImgAndSave(file.buffer, filename + '-thumb', {
        resize: { width: 300 },
      });

    const newMedia: MediaProps = {
      original_name: file.originalname,
      file_name: outputMetadata.filename,
      mime_type: contentType(outputMetadata.format) as string,
      thumbnail_generated: isThumbnail,
      submittedBy: user,
    };

    await this.create(newMedia);

    return outputMetadata.filename;
  }
}
