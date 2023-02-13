'use strict';
import { Method, Service } from '../../src';
import { BaseService } from './baseFactory.service';
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
@Service({
  name: 'greeter',
  version: 1,
  mergeActions: true,
  /**
   * Settings
   */
  settings: {
    idField: '_id',
    // Base path
    rest: '/',
    // Validator for the `create` & `insert` actions.
    entityValidator: {
      name: 'string|min:3'
    }
  },
  actions: {
    hi() {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      return <string>this.sayHello();
    }
  },
  methods: {
    sayHello() {
      return 'Hello from service method';
    }
  }
})
export default class GreeterService extends BaseService {
  @Method
  async test() {
    return 'Decorator method!!!';
  }
}
