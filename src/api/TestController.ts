import {Controller} from '@nestjs/common';
import {MessagePattern} from '@nestjs/microservices';

@Controller()
export default class MathController {
  @MessagePattern({cmd: 'sum'})
  // eslint-disable-next-line class-methods-use-this
  accumulate(data: number[]): number {
    return (data || []).reduce((a, b) => a + b);
  }
}
