/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ServiceEvent /* , ServiceEventHandler, EventSchema */ } from 'moleculer';
import { isFunction } from './utils/utility';

import { getMetadata, setMetadata } from './utils/metadata';

/**
 * Options for the event, based off ServiceEvent
 */
export type EventOptions = Partial<Pick<ServiceEvent, Exclude<keyof ServiceEvent, 'handler'>>>;
/**
 * Add metod as a service event handler
 * @param {EventOptions} options
 */
export const Event = (options?: EventOptions): MethodDecorator => {
  return <T>(target: object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => {
    const handler = descriptor.value;
    const eventName: string = (options || {}).name || propertyKey.toString();
    if (isFunction(handler)) {
      const opts: EventOptions = { name: propertyKey.toString(), ...options };
      const events = getMetadata(target, 'events') || {};

      events[eventName] = {
        handler,
        ...opts
      };
      setMetadata(target, 'events', events);

      return descriptor;
    }
    throw new TypeError('An event handler must be a function/method');
  };
};
