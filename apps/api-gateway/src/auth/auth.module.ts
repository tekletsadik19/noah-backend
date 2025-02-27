import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_MICROSERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.AUTH_SERVICE_HOST || 'localhost',
          port: parseInt(process.env.AUTH_SERVICE_PORT || '3001'),
        },
      },
    ]),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
