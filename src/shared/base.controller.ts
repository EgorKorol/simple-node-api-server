import { ILogger } from '../logger/logger.service';
import { Response, Router } from 'express';
import { ExpressReturn, Route } from './types';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export abstract class BaseController {
  private readonly _router: Router;

  constructor(private loggerService: ILogger) {
    this._router = Router();
  }

  get router(): Router {
    return this._router;
  }

  ok<T>(res: Response, message: T): ExpressReturn {
    return this.send<T>(res, 200, message);
  }

  created(res: Response): ExpressReturn {
    return res.sendStatus(201);
  }

  protected bindRouter(routes: Route[]): void {
    for (const { method, path, func, middlewares } of routes) {
      this.loggerService.log(`[BaseController] RUN [${method}] ${path}`);

      const handler = func.bind(this);
      const boundMiddlewares = middlewares?.map((m) => m.execute.bind(m));
      const pipeline = boundMiddlewares ? [...boundMiddlewares, handler] : handler;

      this.router[method](path, pipeline);
    }
  }

  private send<T>(res: Response, code: number, message: T): ExpressReturn {
    return res.status(code).json(message);
  }
}
