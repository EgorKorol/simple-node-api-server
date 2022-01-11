import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { ILogger } from '../logger/logger.service';
import { TYPES } from '../types';

@injectable()
export class DbService {
  client: PrismaClient;

  constructor(@inject(TYPES.LoggerService) private loggerService: ILogger) {
    this.client = new PrismaClient();
  }

  async connect(): Promise<void> {
    try {
      await this.client.$connect();
      this.loggerService.log('[DbService] Connected successfully');
    } catch (error) {
      if (error instanceof Error) {
        this.loggerService.error('[DbService] connection failed:', error.message);
      }
    }
  }

  async disconnect(): Promise<void> {
    await this.client.$disconnect();
  }
}
