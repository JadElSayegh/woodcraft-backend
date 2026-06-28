// AppService: simple service for basic app info
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  // getHello: returns a simple greeting string
  getHello(): string {
    return 'Hello World!';
  }
}
