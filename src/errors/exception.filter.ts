import { TYPES } from './../types';
import { ILogger } from './../logger/logger.service';
import { HTTPError } from './http.error';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';

export interface IExceptionFilter {
  catch: (err: Error, req: Request, res: Response, next: NextFunction) => void;
}

@injectable()
export class ExceptionFilter implements IExceptionFilter {
  constructor(@inject(TYPES.LoggerService) private loggerService: ILogger) {}

  catch(err: Error | HTTPError, req: Request, res: Response, next: NextFunction): void {
    if (err instanceof HTTPError) {
      this.loggerService.error(`[${err.context}] Error ${err.statusCode}: ${err.message}`);
      res.status(err.statusCode).send({ err: err.message });
    } else {
      this.loggerService.error(`${err.message}`);
      res.status(500).json({ err: err.message });
    }
  }
}
