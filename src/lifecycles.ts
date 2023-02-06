import { isFunction } from './utils/utility';

import { setMetadata } from './utils/metadata';

/**
 * Available lifecycle events
 */
export type LifeCycleEventNames = 'created' | 'merged' | 'started' | 'stopped';

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
 * Service created event
 */
export const ServiceMerged = (): MethodDecorator => {
  return lifeCycleEvent('merged');
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
