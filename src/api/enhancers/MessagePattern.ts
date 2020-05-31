import {MessagePattern as NestMessagePattern} from '@nestjs/microservices';
import {CreateRouterPattern} from 'api/entities/CreateRouter';
import {CreateTransportPattern} from 'api/entities/CreateTransport';
import {ConnectTransportPattern} from '../entities/ConnectTransport';
import {SendTrackPattern} from '../entities/SendTrack';
import {CreateConsumerPattern} from '../entities/CreateConsumer';
import {FindProducerByRoomIdPattern} from '../entities/FindProducerByRoomId';

export const MessagePattern = (
  pattern:
    | CreateRouterPattern
    | CreateTransportPattern
    | ConnectTransportPattern
    | SendTrackPattern
    | CreateConsumerPattern
    | FindProducerByRoomIdPattern,
) => NestMessagePattern(pattern);
