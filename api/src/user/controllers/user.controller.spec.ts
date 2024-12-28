import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '../../shared/guards/auth/auth.guard';
import { MatchUsernameGuard } from '../../shared/guards/user/user.guard';
import { UpdateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';
import { UserController } from './user.controller';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            getUserByUserName: jest.fn(),
            updateUser: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              return true;
            }),
          },
        },
        {
          provide: AuthGuard,
          useValue: {
            canActivate: () => true,
          },
        },
        {
          provide: MatchUsernameGuard,
          useValue: {
            canActivate: () => true,
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should get user by username', async () => {
    const mockUser: User = {
      userName: 'testuser',
    };

    jest
      .spyOn(userService, 'getUserByUserName')
      .mockResolvedValueOnce(mockUser);

    const result = await controller.getUserByUserName('testuser');

    expect(result).toEqual(mockUser);
  });

  it('should throw NotFoundException if user not found', async () => {
    jest.spyOn(userService, 'getUserByUserName').mockResolvedValueOnce(null);

    await expect(controller.getUserByUserName('testuser')).rejects.toThrow(
      "L'utilisateur testuser n'a pas été trouvé",
    );
  });

  it('should update user', async () => {
    const mockUser: User = {
      userName: 'testuser',
    };

    jest.spyOn(userService, 'updateUser').mockResolvedValueOnce(mockUser);

    const updateUserDto: UpdateUserDto = {
      firstName: 'John',
    };

    const result = await controller.updateUser('testuser', updateUserDto);

    expect(result).toEqual(mockUser);
  });

  it('should throw NotFoundException if user not found on update', async () => {
    jest.spyOn(userService, 'updateUser').mockResolvedValueOnce(null);

    const updateUserDto: UpdateUserDto = {
      firstName: 'John',
    };

    await expect(
      controller.updateUser('testuser', updateUserDto),
    ).rejects.toThrow("L'utilisateur testuser n'a pas été trouvé");
  });
});
