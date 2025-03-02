import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from './resources/posts/posts.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './resources/users/users.module';
import { AuthModule } from './resources/auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ServeStaticModule } from '@nestjs/serve-static';
import {
  ConfigOptions,
  RedisOptions,
  ServeStaticOptions,
  TypeOrmOptions,
} from './config/app-options.constants';

@Module({
  imports: [
    ConfigModule.forRoot(ConfigOptions),
    CacheModule.registerAsync(RedisOptions),
    TypeOrmModule.forRootAsync(TypeOrmOptions),
    ServeStaticModule.forRoot(ServeStaticOptions),
    PostsModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
