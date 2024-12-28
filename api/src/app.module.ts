import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { MongoModule } from './mongo/mongo.module';

import { AppLoggerMiddleware } from './middlewares/logger.middleware';

@Module({
  imports: [MongoModule, ConfigModule.forRoot({ isGlobal: true })],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AppLoggerMiddleware)
      .exclude(
        { path: 'health', method: RequestMethod.GET },
        { path: 'static/*', method: RequestMethod.GET },
      )
      .forRoutes('*');
  }
}
