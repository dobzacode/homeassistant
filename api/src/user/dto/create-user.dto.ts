export class CreateUserDto {
  readonly sub: string;
  readonly email?: string;
  readonly userName?: string;
  readonly firstName?: string;
  readonly lastName?: string;
}

export class UpdateUserDto {
  readonly email?: string;
  readonly nickName?: string;
  readonly firstName?: string;
  readonly lastName?: string;
}
