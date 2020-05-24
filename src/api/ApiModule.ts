import {Module} from '@nestjs/common';
import TestController from './TestController';

@Module({
  imports: [
    //
    // ManagerModule,
    // EnhancersModule,
  ],
  controllers: [
    //
    TestController,
  ],
  exports: [],
})
export class ApiModule {}
