import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { comparePasswords } from './helpers/passwordHasher';
import { createUserSession, removeUserSession } from './helpers/userSession';
import { UserSessionData } from 'src/types/auth';
import { Request, Response } from 'express';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { UserWithNoCredentials } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @Inject(CACHE_MANAGER) public cacheManager: Cache,
  ) {}

  async login(
    loginDto: LoginDto,
    response: Response,
  ): Promise<UserWithNoCredentials | null> {
    const user = await this.usersRepository.findOne({
      where: {
        email: loginDto.email,
      },
      select: {
        name: true,
        salt: true,
        password: true,
        email: true,
        id: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isCorrectPassword = await comparePasswords({
      hashedPassword: user.password,
      password: loginDto.password,
      salt: user.salt,
    });

    if (!isCorrectPassword) {
      throw new NotFoundException('User not found');
    }

    const sessionData: UserSessionData = {
      id: user.id,
      role: 'user',
    };

    await createUserSession(sessionData, response, this.cacheManager);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, salt, ...userWithNoCredentials } = user;

    return userWithNoCredentials;
  }

  async logout(request: Request, response: Response) {
    await removeUserSession(request, response, this.cacheManager);
    return { success: true };
  }
}
