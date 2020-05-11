import { Service } from '../../src';
import moleculer, { ServiceSettingSchema } from 'moleculer';
import DbMixin from 'moleculer-db';

@Service<ServiceSettingSchema>({
  mixins: [DbMixin]
})
export default class DbService extends moleculer.Service {
  public connected = false;

  public afterConnected() {
    this.connected = true;
  }

  entityCreated(data: any) {
    this.logger.info(data);
  }

  entityUpdated(data: any) {
    this.logger.info(data);
  }

  public entityRemoved(data: any) {
    this.logger.info(data);
  }
}
