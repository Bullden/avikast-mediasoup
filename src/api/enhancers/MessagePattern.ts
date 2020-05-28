import {MessagePattern as NestMessagePattern} from '@nestjs/microservices';
import {CreateRouterPattern} from 'api/entities/CreateRouter';
import {CreateTransportPattern} from 'api/entities/CreateTransport';

export const MessagePattern = (pattern: CreateRouterPattern | CreateTransportPattern) =>
  NestMessagePattern(pattern);
