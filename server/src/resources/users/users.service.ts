import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import {
  generateSalt,
  hashPassword,
} from 'src/resources/auth/helpers/passwordHasher';
import {
  createUserSession,
  getUserFromSession,
  removeUserSession,
} from '../auth/helpers/userSession';
import { Request, Response } from 'express';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @Inject(CACHE_MANAGER) public cacheManager: Cache,
  ) {}

  async findOne(request: Request, response: Response): Promise<User | null> {
    const userSession = await getUserFromSession(request, this.cacheManager);

    if (!userSession) {
      throw new ForbiddenException();
    }

    const user = await this.usersRepository.findOne({
      where: { id: userSession.id },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    // Refresh user session expiration time
    await removeUserSession(request, response, this.cacheManager);
    await createUserSession(user, response, this.cacheManager);

    return user;
  }

  async create(createUserDto: CreateUserDto, response: Response) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists.');
    }

    const generatedSalt = generateSalt();

    const hashedPassword = await hashPassword(
      createUserDto.password,
      generatedSalt,
    );

    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      salt: generatedSalt,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, salt, ...userWithNoPassword } =
      await this.usersRepository.save(newUser);

    await createUserSession(userWithNoPassword, response, this.cacheManager);

    return userWithNoPassword;
  }
}
