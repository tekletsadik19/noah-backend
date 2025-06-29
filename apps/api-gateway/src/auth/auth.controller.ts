import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

import { CreateUserDto, User } from '@nestjs-microservices/shared';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() createUserDto: CreateUserDto) {
    console.log('Login attempt for user:', createUserDto.username);
    try {
      const user: User = await lastValueFrom(this.authService.getUser(createUserDto), {
        defaultValue: undefined,
      });
      console.log('Retrieved user:', user);
      
      if (!user) {
        throw new BadRequestException('Invalid credentials');
      }

      const isMatch = user.password === createUserDto.password;
      if (!isMatch) {
        throw new BadRequestException('Incorrect password');
      }

      console.log(`User ${user.username} successfully logged in.`);
      return user;
    } catch (error) {
      console.error('Error in login:', error);
      throw error;
    }
  }

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const user: User = await lastValueFrom(this.authService.getUser(createUserDto), {
      defaultValue: undefined,
    });
    if (user) {
      throw new BadRequestException(
        `Username ${createUserDto.username} already exists!`
      );
    }

    return this.authService.createUser(createUserDto);
  }
}
