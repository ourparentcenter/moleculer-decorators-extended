import Moleculer from 'moleculer';
import { Action, Method, Service } from '../../src';
import { User } from './api.service';

interface ChatsActionParams {
  withUser: string;
}

export interface AuthMeta {
  user: User;
  $statusCode?: number;
}

export interface AuthContext<P = Moleculer.GenericObject> extends Moleculer.Context<P, AuthMeta> {
  meta: AuthMeta;
  params: P;
}

@Service()
export default class GetTest extends Moleculer.Service {
  @Action({
    params: {
      withUser: 'string'
    }
  })
  public async getModel(ctx: AuthContext<ChatsActionParams>) {
    const { withUser } = ctx.params;
    const fromUser = ctx.meta.user.id;
    return this._getModel(withUser, fromUser);
  }

  @Method
  private _getModel(_withUser: string, _fromUser: string): Promise<User> {
    return Promise.resolve({ id: '5' });
  }

  created(): void {
    this.logger.info('Successfully created!');
  }
}
