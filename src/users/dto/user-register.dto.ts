import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserRegisterDTO {
  @IsEmail({}, { message: 'Wrong email' })
  email: string;

  @IsString({ message: 'Not a string' })
  @IsNotEmpty({ message: 'Empty password' })
  password: string;

  @IsString({ message: 'Not a string' })
  @IsNotEmpty({ message: 'Empty name' })
  name: string;
}
