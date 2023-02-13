'use strict';
import { Method, Service } from '../../src';
import { BaseService } from './baseFactory.service';
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
@Service({
  name: 'greeter2',
  version: 2,
  mergeActions: false,
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
    hi2() {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      return <string>this.sayHello2();
    }
  },
  methods: {
    sayHello2() {
      return 'Hello from service method';
    }
  }
})
export default class Greeter2Service extends BaseService {
  @Method
  async test2() {
    return 'Decorator method!!!';
  }
}
