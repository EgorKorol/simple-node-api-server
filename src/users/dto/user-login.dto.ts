import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class UserLoginDTO {
  @IsEmail({}, { message: 'Wrong email' })
  email: string;

  @IsString({ message: 'Not a string' })
  @IsNotEmpty({ message: 'Empty password' })
  password: string;
}
