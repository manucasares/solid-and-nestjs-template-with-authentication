import { Controller, Get, Req, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { Request, Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  findMe(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.usersService.findOne(request, response);
  }
}
