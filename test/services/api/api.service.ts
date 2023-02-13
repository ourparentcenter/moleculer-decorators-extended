/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { IncomingMessage, ServerResponse } from 'http';
import Moleculer from 'moleculer';
import { Method, Service } from '../../../src';
import ApiGateway from 'moleculer-web';
import { additionalServiceRoutes } from './additionalRoutes';

export interface User {
  id: string;
}

const { Errors } = ApiGateway;

@Service({
  name: 'api',
  mixins: [ApiGateway],
  settings: {
    port: process.env.PORT || 9000,
    routes: [
      {
        path: '/getTest',
        aliases: {
          'GET getModel/:withUser': 'GetTest.getModel'
        },
        authentication: true,
        whitelist: ['**']
      },
      ...additionalServiceRoutes
    ]
  }
})
export default class Api extends Moleculer.Service {
  @Method
  public async authenticate(ctx: Moleculer.Context, route: string, req: IncomingMessage, res: ServerResponse) {
    const accessToken = req.headers.authorization;
    if (accessToken) {
      const user = await this._getUserFromRemoterService(ctx, accessToken);
      if (user) {
        return Promise.resolve({ ...user.user, id: user.user.externalId });
      } else {
        return Promise.reject(new Errors.UnAuthorizedError(Errors.ERR_INVALID_TOKEN, {}));
      }
    } else {
      return Promise.reject(new Errors.UnAuthorizedError(Errors.ERR_NO_TOKEN, {}));
    }
  }

  @Method
  private _getUserFromRemoterService(ctx: Moleculer.Context, _accessToken: string): Promise<any> {
    return Promise.resolve({ user: {} });
  }
}
