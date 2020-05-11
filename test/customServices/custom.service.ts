import { Context } from 'moleculer';
import { CustomService } from './CustomServiceFactory';
import { Action, Service } from '../../src';

@Service()
export default class CustomTest extends CustomService {
  @Action()
  public async testAction(_ctx: Context) {
    return this.foo();
  }

  created(): void {
    this.logger.info('Successfully created!');
  }
}
