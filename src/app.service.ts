import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  health(): { message: string } {
    return { message: 'Ok' };
  }
}
