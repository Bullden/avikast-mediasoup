import {MessagePattern as NestMessagePattern} from '@nestjs/microservices';
import {CreateRouterPattern} from 'api/entities/CreateRouter';
import {CreateTransportPattern} from 'api/entities/CreateTransport';
import {ConnectTransportPattern} from '../entities/ConnectTransport';

export const MessagePattern = (
  pattern: CreateRouterPattern | CreateTransportPattern | ConnectTransportPattern,
) => NestMessagePattern(pattern);
