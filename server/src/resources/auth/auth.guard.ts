import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { getUserFromSession } from './helpers/userSession';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(CACHE_MANAGER) public cacheManager: Cache,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const allowUnauthorizedRequest = this.reflector.get<boolean>(
      'allowUnauthorizedRequest',
      context.getHandler(),
    );

    if (allowUnauthorizedRequest) {
      return true;
    }

    try {
      const user = await getUserFromSession(request, this.cacheManager);
      if (!user) throw new UnauthorizedException();
      return true;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      error;
      throw new UnauthorizedException();
    }
  }
}
