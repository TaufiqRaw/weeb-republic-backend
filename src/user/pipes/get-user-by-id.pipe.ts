import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { UserService } from '../user.service';

@Injectable()
export class GetUserByIdPipe implements PipeTransform {
  constructor(
    private readonly userService : UserService
  ){}
  async transform(id: number, metadata: ArgumentMetadata) {
    const user = this.userService.findOne(id)
    if(null)
      throw new BadRequestException('User is invalid');
    return user;
  }
}
