import { Service, ServiceBroker, ServiceSchema } from 'moleculer';

export class CustomService extends Service {
  constructor(broker: ServiceBroker, schema: ServiceSchema) {
    super(broker, schema);
  }

  foo() {
    return 'bar';
  }
}
