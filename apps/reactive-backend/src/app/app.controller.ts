import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  getData() {
    return { message: 'Welcome to reactive-backend!' };
  }
}
