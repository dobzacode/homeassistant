import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '../../shared/guards/auth/auth.guard';
import { MatchUsernameGuard } from '../../shared/guards/user/user.guard';
import { UpdateUserDto } from '../dto/create-user.dto';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard, MatchUsernameGuard)
  @Get(':userName')
  async getUserByUserName(@Param('userName') userName: string) {
    const user = await this.userService.getUserByUserName(userName);
    if (!user) {
      throw new NotFoundException(
        `L'utilisateur ${userName} n'a pas été trouvé`,
      );
    }
    return user;
  }

  @UseGuards(AuthGuard, MatchUsernameGuard)
  @Put(':userName')
  async updateUser(
    @Param('userName') userName: string,
    @Body() UpdateUserDto: UpdateUserDto,
  ) {
    const user = await this.userService.updateUser(userName, UpdateUserDto);
    if (!user) {
      throw new NotFoundException(
        `L'utilisateur ${userName} n'a pas été trouvé`,
      );
    }
    return user;
  }
}
