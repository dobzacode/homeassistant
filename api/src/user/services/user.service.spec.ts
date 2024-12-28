import { Test } from '@nestjs/testing';
import { UpdateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository.interface';
import { USER_REPOSITORY_TOKEN } from '../repositories/user.repository.token';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {
            findByUserName: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
    userRepository = moduleRef.get<UserRepository>(USER_REPOSITORY_TOKEN);
  });

  it('should retrieve user by username', async () => {
    const mockUser: User = {
      userName: 'testuser',
    };
    jest
      .spyOn(userRepository, 'findByUserName')
      .mockResolvedValueOnce(mockUser);
    const result = await userService.getUserByUserName('testuser');
    expect(result).toEqual(mockUser);
  });

  it('should handle error when retrieving user', async () => {
    const errorMessage = 'User not found';
    jest
      .spyOn(userRepository, 'findByUserName')
      .mockRejectedValueOnce(new Error(errorMessage));

    try {
      await userService.getUserByUserName('testuser');
      fail('Expected an error');
    } catch (error) {
      expect(error.message).toBe(errorMessage);
    }
  });

  it('should update user', async () => {
    const mockUser: User = {
      userName: 'testuser',
      firstName: 'OldFirstName',
    };

    jest.spyOn(userRepository, 'update').mockResolvedValueOnce({
      ...mockUser,
      firstName: 'John',
    });

    const updateUserDto: UpdateUserDto = {
      firstName: 'John',
    };

    const result = await userService.updateUser('testuser', updateUserDto);

    expect(result.firstName).toEqual('John');
    expect(userRepository.update).toHaveBeenCalledWith(
      'testuser',
      updateUserDto,
    );
  });
  it('should handle error when updating user', async () => {
    const errorMessage = 'Error updating user';
    jest
      .spyOn(userRepository, 'update')
      .mockRejectedValueOnce(new Error(errorMessage));

    const updateUserDto: UpdateUserDto = {
      firstName: 'John',
    };

    try {
      await userService.updateUser('testuser', updateUserDto);
      fail('Expected an error');
    } catch (error) {
      expect(error.message).toBe(errorMessage);
    }
  });
});
