import {MessagePattern as NestMessagePattern} from '@nestjs/microservices';
import {patterns} from './patterns';

export const MessagePattern = (pattern: patterns) => NestMessagePattern(pattern);
