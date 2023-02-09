/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Service as MolecService, ServiceSchema, ServiceBroker } from 'moleculer';
import { isFunction, /* omit, */ getMetadata, getMetadataKeys, removeMetadata } from './utils';
import { META_PREFIX } from './constants';
import { DecoratorError } from './error';

export interface Options extends Partial<ServiceSchema> {
  name?: string;
  constructOverride?: boolean;
  skipHandler?: boolean;
}

const blacklist = ['created', 'started', 'stopped', 'actions', 'methods', 'events', 'broker', 'logger'];
const blacklist2 = ['metadata', 'settings', 'mixins', 'name', 'version'].concat(blacklist);
const defaultServiceOptions: Options = {
  constructOverride: true,
  skipHandler: false, // not needed, just for clarity
  mergeActions: false // not needed, just for clarity
};

// // Instead of using moleculer's ServiceBroker, we will fake the broker class to pass it to service constructor
const mockServiceBroker = { Promise };

const serviceDescriptorConstructor = (parentService: any, base: ServiceSchema, vars: any) => {
  // Override properties defined in @Service
  const ServiceClass = new parentService.constructor(mockServiceBroker);

  Object.getOwnPropertyNames(ServiceClass).forEach((key) => {
    const propertyDescriptor = Object.getOwnPropertyDescriptor(ServiceClass, key);
    if (!blacklist.includes(key) && isFunction(ServiceClass[key]) && propertyDescriptor) {
      base[key] = propertyDescriptor.value;
      if (!blacklist2.includes(key)) {
        vars[key] = propertyDescriptor.value;
      }
    }
  });

  /* Insane hack below :D
   * It's needed since moleculer don't transfer all defined props in the schema to the actual service, so we have to do it.
   * Side note: This is quite hacky and would be a performance loss if the created function would be called over and over, since it's called once, it's more than fine :)
   */

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const bypass = Object.defineProperty; // typescript fix
  const obj: any = {}; // placeholder

  // Defining our 'own' created function
  bypass(obj, 'created', {
    value: function created(broker: ServiceBroker) {
      for (const key in vars) {
        if (Object.prototype.hasOwnProperty.call(vars, key)) {
          this[key] = vars[key];
        }
      }

      // Check if user defined a created function, if so, we need to call it after ours.
      const ownPropertyDescriptor = Object.getOwnPropertyDescriptor(parentService, 'created');
      if (ownPropertyDescriptor) {
        ownPropertyDescriptor.value.call(this, broker);
      }
    },
    writable: true,
    enumerable: true,
    configurable: true
  });

  base['created'] = obj.created;
};

/**
 * Type guard to ensure a constructor is an extended Moleculer Service
 * @param constructor The constructor to check
 */
export const isServiceClass = (constructor: object): constructor is ServiceConstructor => {
  // eslint-disable-next-line no-prototype-builtins
  // return typeof constructor === 'function' && MolecService.isPrototypeOf(constructor);
  return typeof constructor === 'function';
};

/**
 * Get all the metadata from the class and add it to a schema ouput
 * @param constructor The class constructor on which to find the metadata
 */
export const getClassMetadata = (constructor: ServiceConstructor): Partial<ServiceSchema> => {
  const keys: any[] = getMetadataKeys(constructor);
  const schemaKeys: Partial<ServiceSchema & { [k: string]: any }> = {};

  keys.forEach((key) => {
    if (typeof key === 'string' && key.startsWith(META_PREFIX)) {
      const desc = getMetadata(constructor, key);
      schemaKeys[key.replace(new RegExp(`^${META_PREFIX}`), '')] = desc;
      removeMetadata(constructor, key);
    }
  });

  return schemaKeys;
};

/**
 * These options should be set in the class itself instead of the options
 */
export type ServiceConstructor = new (...args: any[]) => MolecService;

export type ServiceDecorator = <T extends ServiceConstructor>(constructor: T) => T;

/**
 * Add all handlers to the schema for the service
 * @param options
 */
export const Service = <O extends Options>(opts?: O): ServiceDecorator => {
  const options = opts || ({} as Options);

  return <T extends ServiceConstructor>(constructor: T) => {
    if (isServiceClass(constructor)) {
      let schema: ServiceSchema = {
        name: options?.name || constructor.name,
        ...defaultServiceOptions,
        ...options
      };

      try {
        const vars: any = {};
        Object.getOwnPropertyNames(constructor.prototype).forEach((key: string) => {
          if (key === 'constructor') {
            if (schema.constructOverride) {
              serviceDescriptorConstructor(constructor.prototype, schema, vars);
            }
            return;
          }

          const descriptor = Object.getOwnPropertyDescriptor(constructor.prototype, key)!;

          if (key === 'created' && !schema.constructOverride) {
            schema[key] = descriptor.value;
          }

          if (['started', 'stopped'].includes(key)) {
            schema[key] = descriptor.value;
            return;
          }

          if (['events', 'methods', 'actions'].includes(key)) {
            if (schema[key]) {
              Object.assign(schema[key], descriptor.value);
            } else {
              schema[key] = descriptor.value;
            }
            return;
          }

          if (['afterConnected', 'entityCreated', 'entityUpdated', 'entityRemoved'].includes(key)) {
            schema[key] = descriptor.value;
          }
        });
        const keys = getClassMetadata(constructor.prototype);
        const actions = schema.actions;
        schema = { ...schema, ...keys };
        if (schema.mergeActions && schema.actions) {
          Object.assign(schema.actions, actions);
        }
      } catch (ex: any) {
        throw new DecoratorError('An error occured creating the service schema', ex as Error | undefined);
      }

      return class extends constructor {
        constructor(...args: any[]) {
          super(...args);
          this.parseServiceSchema(schema);
        }
      };
    }
    throw TypeError('Class must extend Service');
  };
};
