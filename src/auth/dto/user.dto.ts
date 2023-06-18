import { IsString, MinLength } from 'class-validator';

export class UserDTO {
  @IsString()
  @MinLength(8, { message: 'Логин должен быть больше 8 символов' })
  login: string;

  @IsString()
  @MinLength(6, { message: 'Пароль должен быть больше 6 символов' })
  password: string;
}
