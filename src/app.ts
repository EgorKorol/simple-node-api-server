import { IConfigService } from './config/config.service';
import { TYPES } from './types';
import { UsersController } from './users/users.controller';
import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import { ILogger } from './logger/logger.service';
import 'reflect-metadata';
import { json } from 'body-parser';
import { IExceptionFilter } from './errors/exception.filter';
import { DbService } from './database/db.service';
import { AuthMiddleware } from './auth/auth.middleware';

@injectable()
export class App {
  app: Express;
  server: Server;
  readonly port: number;

  constructor(
    @inject(TYPES.LoggerService) private loggerService: ILogger,
    @inject(TYPES.UsersController) private UsersController: UsersController,
    @inject(TYPES.ExceptionFilter) private exceptionFilter: IExceptionFilter,
    @inject(TYPES.DbService) private dbService: DbService,
    @inject(TYPES.ConfigService) private configService: IConfigService
  ) {
    this.app = express();
    this.app.disable('x-powered-by');

    this.port = 8080;
  }

  useMiddleware(): void {
    this.app.use(json());

    const authMiddleware = new AuthMiddleware(this.configService.get('SECRET'));
    this.app.use(authMiddleware.execute.bind(authMiddleware));
  }

  useRoutes(): void {
    this.app.use('/users', this.UsersController.router);
  }

  useExceptionFilters(): void {
    this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }

  async init(): Promise<void> {
    this.useMiddleware();
    this.useRoutes();
    this.useExceptionFilters();

    await this.dbService.connect();

    this.server = this.app.listen(this.port);
    this.loggerService.log(`[App] Server running at http://localhost:${this.port}`);
  }

  close(): void {
    this.server.close();
  }
}
