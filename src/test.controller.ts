import { Controller, Get } from '@nestjs/common';

@Controller()
export class TestController {
  @Get('rofl')
  getHello(): void {
    console.log('rofl2');
  }
}
