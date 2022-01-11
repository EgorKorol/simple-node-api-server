import { ValidateMiddleware } from '../shared/validate.middleware';
import { HTTPError } from './../errors/http.error';
import { UsersService } from './users.service';
import { UserLoginDTO } from './dto/user-login.dto';
import { TYPES } from './../types';
import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../shared/base.controller';
import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/logger.service';
import 'reflect-metadata';
import { UserRegisterDTO } from './dto/user-register.dto';
import { IConfigService } from '../config/config.service';
import { sign } from 'jsonwebtoken';
import { AuthGuard } from '../auth/auth.guard';

export interface IUsersController {
  login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  register: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

@injectable()
export class UsersController extends BaseController implements IUsersController {
  constructor(
    @inject(TYPES.LoggerService) private logger: ILogger,
    @inject(TYPES.UsersService) private usersService: UsersService,
    @inject(TYPES.ConfigService) private configService: IConfigService
  ) {
    super(logger);
    this.bindRouter([
      {
        path: '/register',
        method: 'post',
        func: this.register,
        middlewares: [new ValidateMiddleware(UserRegisterDTO)],
      },
      {
        path: '/login',
        method: 'post',
        func: this.login,
        middlewares: [new ValidateMiddleware(UserLoginDTO)],
      },
      {
        path: '/info',
        method: 'get',
        func: this.info,
        middlewares: [new AuthGuard()],
      },
    ]);
  }

  async login(
    { method, url, body }: Request<{}, {}, UserLoginDTO>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    this.logger.log(`Request to [${method}] ${url}`);

    const result = await this.usersService.validateUser(body);

    if (!result) {
      return next(new HTTPError(401, 'Not authorized', 'login'));
    }

    const jwt = await this.signJWT(body.email, this.configService.get('SECRET'));
    this.ok(res, { jwt });
  }

  async register(
    { method, url, body }: Request<{}, {}, UserRegisterDTO>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    this.logger.log(`Request to [${method}] ${url}`);

    const result = await this.usersService.createUser(body);

    if (!result) {
      return next(new HTTPError(422, 'User already exist', 'register'));
    }

    this.ok(res, { email: result.email, id: result.id });
  }

  async info({ user }: Request, res: Response, next: NextFunction): Promise<void> {
    const userInfo = await this.usersService.getUserInfo(user);

    this.ok(res, { email: userInfo?.email, id: userInfo?.id });
  }

  private signJWT(email: string, secret: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      sign(
        {
          email,
          iat: Math.floor(Date.now() / 1000),
        },
        secret,
        {
          algorithm: 'HS256',
        },
        (err, token) => {
          if (err) {
            reject(err);
          }
          resolve(token as string);
        }
      );
    });
  }
}
