import { Controller, Get, Body, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { AppService } from './app.service';
import { RandomDto } from './classes/random-dto';
import { ApigatewayObject } from './classes/apigateway-object';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('distribution')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiConsumes('application/json')
  @ApiResponse({ status: 200, description: 'Distribution retrieved' })
  getRandom(@Body() randomDto: RandomDto): ApigatewayObject {
   return this.appService.getRandom(randomDto);
  }
}
