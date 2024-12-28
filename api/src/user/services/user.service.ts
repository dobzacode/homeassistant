import { Inject, Injectable } from '@nestjs/common';
import { UpdateUserDto } from '../dto/create-user.dto';
import { UserRepository } from '../repositories/user.repository.interface';
import { USER_REPOSITORY_TOKEN } from '../repositories/user.repository.token';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepository,
  ) {}

  async getUserByUserName(userName: string) {
    const user = await this.userRepository.findByUserName(userName);
    return user;
  }

  async updateUser(userName: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.update(userName, updateUserDto);
    if (!user) {
      return null;
    }
    return user;
  }
}
