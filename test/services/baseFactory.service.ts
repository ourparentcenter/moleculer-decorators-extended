import { Context, Service, ServiceBroker, ServiceSchema } from 'moleculer';
import { Get, Post, ServiceStarted, ServiceStopped } from '../../src';
import { GreeterWelcomeParams } from '../../types';

export class BaseService extends Service {
  constructor(broker: ServiceBroker, schema: ServiceSchema) {
    super(broker, schema);
  }

  @Get('/hello', {
    name: 'hello'
  })
  async hello() {
    return 'Hello Moleculer';
  }

  @Post('/welcome', {
    name: 'welcome',
    params: {
      name: 'string'
    }
  })
  async welcome(ctx: Context<GreeterWelcomeParams, Record<string, unknown>>) {
    return `Welcome, ${ctx.params.name}`;
  }

  @ServiceStarted()
  svcStarted() {
    this.logger.info('♻ Service started, ready for connections');
  }

  @ServiceStopped()
  svcStopped() {
    this.logger.info('♻ Service stopped, connections terminated');
  }
}
