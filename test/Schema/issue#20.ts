import 'reflect-metadata';
import { Action, Service } from '../../src';
import web from 'moleculer-web';
import Moleculer = require('moleculer');

@Service({
  mixins: [web]
})
export default class DemoController extends Moleculer.Service {
  @Action({
    rest: 'GET /welcome'
  })
  welcome(_ctx: any) {
    return 'Hello';
  }
}
