import {Controller} from '@nestjs/common';
import {MessagePattern} from '@nestjs/microservices';
import IRoomManager from '../managers/room/IRoomManager';

@Controller()
export default class MathController {
  constructor(private readonly roomManager: IRoomManager) {}

  @MessagePattern({cmd: 'sum'})
  // eslint-disable-next-line class-methods-use-this
  accumulate(data: number[]): number {
    return (data || []).reduce((a, b) => a + b);
  }
}
