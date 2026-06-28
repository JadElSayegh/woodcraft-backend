// AppController: basic health/root endpoint
import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('System')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  // getHello: returns basic app greeting (used for health check)
  @ApiOperation({ summary: 'Health check' })
  @ApiOkResponse({
    description: 'Basic application greeting.',
    content: {
      'text/plain': {
        schema: {
          type: 'string',
          example: 'Hello World!',
        },
      },
    },
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
