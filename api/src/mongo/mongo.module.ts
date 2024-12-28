import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

export const MongoModule = MongooseModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    uri: configService.get<string>('DATABASE_URL'),
    ssl: true,
    connectionErrorFactory: (error) => {
      console.error(error);
      throw error;
    },
  }),
  inject: [ConfigService],
});
