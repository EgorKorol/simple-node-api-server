import { DbService } from './../database/db.service';
import { TYPES } from './../types';
import { UserModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { User } from './user.entity';

export interface IUsersRepository {
  create: (user: User) => Promise<UserModel>;
  find: (email: string) => Promise<UserModel | null>;
}

@injectable()
export class UsersRepository implements IUsersRepository {
  constructor(@inject(TYPES.DbService) private dbService: DbService) {}

  async create({ password, email, name }: User): Promise<UserModel> {
    return this.dbService.client.userModel.create({
      data: {
        password,
        email,
        name,
      },
    });
  }

  async find(email: string): Promise<UserModel | null> {
    return this.dbService.client.userModel.findFirst({
      where: {
        email,
      },
    });
  }
}
