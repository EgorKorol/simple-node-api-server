import { NextFunction, Request, Response } from 'express';
import { IMiddleware } from '../shared/types';

export class AuthGuard implements IMiddleware {
  execute(req: Request, res: Response, next: NextFunction): void {
    if (req.user) {
      return next();
    }

    res.status(401).send({ error: 'Not authorized' });
  }
}
