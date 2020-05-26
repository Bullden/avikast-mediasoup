import {Module} from '@nestjs/common';
import TestController from './TestController';
import {ManagerModule} from '../managers/ManagerModule';

@Module({
  imports: [
    //
    ManagerModule,
    // EnhancersModule,
  ],
  controllers: [
    //
    TestController,
  ],
  exports: [],
})
export class ApiModule {}
