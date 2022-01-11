import { NextFunction, Request, Response, Router } from 'express';

type IExecuteFunction = (req: Request, res: Response, next: NextFunction) => void;

export interface IMiddleware {
  execute: IExecuteFunction;
}

export interface Route {
  path: string;
  func: IExecuteFunction;
  method: keyof Pick<Router, 'get' | 'post' | 'put' | 'delete' | 'patch'>;
  middlewares?: IMiddleware[];
}

export type ExpressReturn = Response<any, Record<string, any>>;
