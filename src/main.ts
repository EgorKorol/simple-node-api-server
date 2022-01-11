import { App } from './app';
import { TYPES } from './types';
import { DbService } from './database/db.service';
import { Container, ContainerModule, interfaces } from 'inversify';
import { LoggerService, ILogger } from './logger/logger.service';
import { UsersService, IUsersService } from './users/users.service';
import { ConfigService, IConfigService } from './config/config.service';
import { IUsersRepository, UsersRepository } from './users/users.repository';
import { UsersController, IUsersController } from './users/users.controller';
import { ExceptionFilter, IExceptionFilter } from './errors/exception.filter';

interface IBootstrap {
  appContainer: Container;
  app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<ILogger>(TYPES.LoggerService).to(LoggerService).inSingletonScope();
  bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter).inSingletonScope();
  bind<IUsersController>(TYPES.UsersController).to(UsersController).inSingletonScope();
  bind<IUsersService>(TYPES.UsersService).to(UsersService).inSingletonScope();
  bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
  bind<DbService>(TYPES.DbService).to(DbService).inSingletonScope();
  bind<IUsersRepository>(TYPES.UsersRepository).to(UsersRepository).inSingletonScope();
  bind<App>(TYPES.App).to(App).inSingletonScope();
});

const bootstrap = async (): Promise<IBootstrap> => {
  const appContainer = new Container();
  appContainer.load(appBindings);

  const app = appContainer.get<App>(TYPES.App);
  await app.init();

  return { app, appContainer };
};

export const boot = bootstrap();
