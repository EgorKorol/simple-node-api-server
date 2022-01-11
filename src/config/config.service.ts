import { config, DotenvConfigOutput } from 'dotenv';
import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/logger.service';
import { TYPES } from '../types';
import 'reflect-metadata';

export interface IConfigService {
  get: (key: string) => string;
}

@injectable()
export class ConfigService implements IConfigService {
  private config: DotenvConfigOutput;

  constructor(@inject(TYPES.LoggerService) private loggerService: ILogger) {
    const result = config();

    if (result.error) {
      this.loggerService.error('[ConfigService] Can not read .env or there is no such file');
    } else {
      this.loggerService.log('[ConfigService] Configuration is read');
      this.config = result.parsed as DotenvConfigOutput;
    }
  }

  get(key: string): string {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.config[key];
  }
}
