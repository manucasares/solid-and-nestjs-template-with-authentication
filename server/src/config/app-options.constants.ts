import { join } from 'path';
import KeyvRedis, { Keyv } from '@keyv/redis';
import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ServeStaticModuleOptions } from '@nestjs/serve-static';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import {
  ConfigModule,
  ConfigModuleOptions,
  ConfigService,
} from '@nestjs/config';

import { EnvSchema } from 'src/types/environment';
import { SESSION_EXPIRATION_MS } from 'src/resources/auth/auth.constants';

export const RedisOptions: CacheModuleAsyncOptions = {
  isGlobal: true,
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => {
    const redisHost = configService.get<string>('REDIS_HOST')!;
    const redisPort = parseInt(configService.get<string>('REDIS_PORT')!);

    const redisOptions = {
      url: `redis://${redisHost}:${redisPort}`, // The Redis server URL (use 'rediss' for TLS)

      socket: {
        host: redisHost,
        port: redisPort,
        reconnectStrategy: (retries) => Math.min(retries * 50, 2000), // Custom reconnect logic

        tls: false, // Enable TLS if you need to connect over SSL
        keepAlive: 30000, // Keep-alive timeout (in milliseconds)
      },
    };

    const keyv = new Keyv(new KeyvRedis(redisOptions), {
      ttl: SESSION_EXPIRATION_MS,
    });

    return {
      stores: [keyv],
    };
  },
  inject: [ConfigService],
};

export const TypeOrmOptions: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],

  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_NAME'),
    synchronize: process.env.NODE_ENV !== 'production',
    autoLoadEntities: true,
    // migrations: [] // TODO:
  }),
};

export const ConfigOptions:
  | ConfigModuleOptions<Record<string, any>>
  | undefined = {
  isGlobal: true,
  validate: (config: Record<string, any>) => EnvSchema.parse(config),
};

export const ServeStaticOptions: ServeStaticModuleOptions = {
  rootPath: join(__dirname, '../..', 'public'),
  exclude: ['/api/{*test}'],
  serveStaticOptions: {
    fallthrough: false,
  },
};
