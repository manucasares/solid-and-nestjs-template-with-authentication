import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user-dto';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { AllowUnauthorizedRequest } from 'src/classes/AllowUnauthorizedRequest';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @HttpCode(200)
  @AllowUnauthorizedRequest()
  @Post('sign-in')
  login(
    @Body(ValidationPipe) loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(loginDto, res);
  }

  @HttpCode(200)
  @AllowUnauthorizedRequest()
  @Post('sign-up')
  async signUp(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.usersService.create(createUserDto, response);
  }

  @HttpCode(200)
  @Post('logout')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.logout(request, response);
  }
}
