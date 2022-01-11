import { IConfigService } from './../config/config.service';
import { TYPES } from './../types';
import { inject, injectable } from 'inversify';
import { UserLoginDTO } from './dto/user-login.dto';
import { UserRegisterDTO } from './dto/user-register.dto';
import { User } from './user.entity';
import 'reflect-metadata';
import { IUsersRepository } from './users.repository';
import { UserModel } from '@prisma/client';

export interface IUsersService {
  createUser: (dto: UserRegisterDTO) => Promise<UserModel | null>;
  validateUser: (dto: UserLoginDTO) => Promise<boolean>;
  getUserInfo: (email: string) => Promise<UserModel | null>;
}

@injectable()
export class UsersService implements IUsersService {
  constructor(
    @inject(TYPES.ConfigService) private configService: IConfigService,
    @inject(TYPES.UsersRepository) private usersRepository: IUsersRepository
  ) {}

  async createUser({ name, email, password }: UserRegisterDTO): Promise<UserModel | null> {
    const newUser = new User(email, name);
    const salt = this.configService.get('SALT');

    await newUser.setPassword(password, Number(salt));

    const existedUser = await this.usersRepository.find(email);

    if (existedUser) {
      return null;
    }

    return this.usersRepository.create(newUser);
  }

  async validateUser({ email, password }: UserLoginDTO): Promise<boolean> {
    const existedUser = await this.usersRepository.find(email);

    if (!existedUser) {
      return false;
    }

    const newUser = new User(existedUser.email, existedUser.name, existedUser.password);

    return newUser.comparePassword(password);
  }

  async getUserInfo(email: string): Promise<UserModel | null> {
    return this.usersRepository.find(email);
  }
}
