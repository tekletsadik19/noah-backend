import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { CreateUserDto } from '@nestjs-microservices/shared';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('get_user')
  handleGetUser(user: CreateUserDto) {
    console.log('Received login request for user:', user.username);
    try {
      const result = this.appService.getUser(user.username);
      console.log('Login result:', result);
      return result;
    } catch (error) {
      console.error('Error in handleGetUser:', error);
      throw error;
    }
  }

  @MessagePattern('create_user')
  handleCreateUser(newUser: CreateUserDto) {
    return this.appService.createUser(newUser);
  }
}
