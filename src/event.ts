import { ServiceEvent /* , ServiceEventHandler, EventSchema */ } from 'moleculer';
import { isFunction } from './utils/utility';

import { getMetadata, setMetadata } from './utils/metadata';

// export interface EventOptions extends Partial<EventSchema> {
//   name?: string;
//   group?: string;
//   handler?: ServiceEventHandler; // not really used
// }

/* const Event = (options?: EventOptions) => {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    (target.events || (target.events = {}))[key] = options
      ? {
          ...options,
          handler: descriptor.value
        }
      : descriptor.value;
  };
}; */

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

/**
 * Available lifecycle events
 */
export type LifeCycleEventNames = 'created' | 'started' | 'stopped';

/**
 * Add method as a lifecycle event handler
 * @param name Name of the lifecycle event
 */
export const lifeCycleEvent = (name: LifeCycleEventNames): MethodDecorator => {
  if (!name) {
    throw new ReferenceError('Lifecycle event name required');
  }

  return <T>(target: object, _propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => {
    const handler = descriptor.value;
    if (isFunction(handler)) {
      setMetadata(target, name, handler);

      return descriptor;
    }

    throw new TypeError('A lifecycle event handler must be a function/method');
  };
};

/**
 * Service created event
 */
export const ServiceCreated = (): MethodDecorator => {
  return lifeCycleEvent('created');
};

/**
 * Service started event
 */
export const ServiceStarted = (): MethodDecorator => {
  return lifeCycleEvent('started');
};

/**
 * Service stopped event
 */
export const ServiceStopped = (): MethodDecorator => {
  return lifeCycleEvent('stopped');
};
