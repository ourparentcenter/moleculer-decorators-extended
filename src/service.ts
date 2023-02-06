import { Service as MolecService, ServiceSchema, ServiceBroker } from 'moleculer';

import { isFunction, /* omit, */ getMetadata, getMetadataKeys, removeMetadata } from './utils';

import { META_PREFIX } from './constants';

import { DecoratorError } from './error';
// import { getMetadata, getMetadataKeys, removeMetadata } from './utils/metadata';

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
      // if (base.hasOwnProperty(key)) base[key] = Object.getOwnPropertyDescriptor(ServiceClass, key)!.value;
      base[key] = propertyDescriptor.value;
      if (!blacklist2.includes(key)) {
        // Needed, otherwize if the service is used as a mixin, these variables will overwrite the toplevel's
        vars[key] = propertyDescriptor.value;
        // if (vars.hasOwnProperty(key)) vars[key] = Object.getOwnPropertyDescriptor(ServiceClass, key)!.value;
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

// export const Service = <T extends Options>(opts?: T): Function => {
//   const options = opts || ({} as Options);
//   // eslint-disable-next-line sonarjs/cognitive-complexity
//   return function (constructor: Function) {
//     const base: ServiceSchema = {
//       name: '' // will be overridden
//     };
//     const _options = { ...defaultServiceOptions, ...options };

//     Object.defineProperty(base, 'name', {
//       value: options.name || constructor.name,
//       writable: false,
//       enumerable: true
//     });

//     if (options.name) {
//       delete options.name; // not needed
//     }

//     Object.assign(base, omit(options, Object.keys(defaultServiceOptions))); // Apply

//     const parentService = constructor.prototype;
//     const vars: any = {};
//     Object.getOwnPropertyNames(parentService).forEach(function (key) {
//       if (key === 'constructor') {
//         if (_options.constructOverride) {
//           serviceDescriptorConstructor(parentService, base, vars);
//         }
//         return;
//       }

//       const descriptor = Object.getOwnPropertyDescriptor(parentService, key)!;

//       if (key === 'created' && !_options.constructOverride) {
//         base[key] = descriptor.value;
//       }

//       if (key === 'started' || key === 'stopped') {
//         base[key] = descriptor.value;
//         return;
//       }

//       if (key === 'events' || key === 'methods' || key === 'actions') {
//         base[key] ? Object.assign(Object(base[key]), descriptor.value) : (base[key] = descriptor.value);
//         return;
//       }

//       // moleculer-db lifecycle methods (https://github.com/ColonelBundy/moleculer-decorators/issues/2)
//       if (key === 'afterConnected' || key === 'entityCreated' || key === 'entityUpdated' || key === 'entityRemoved') {
//         base[key] = descriptor.value;
//       }
//     });

//     return class extends parentService.constructor {
//       constructor(broker: ServiceBroker, schema: ServiceSchema) {
//         super(broker, schema);
//         this.parseServiceSchema(base);
//       }
//     };
//   };
// };

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
// export type ServiceOptionsToExclude = 'actions' | 'events' | 'methods' | 'created' | 'started' | 'stopped';

// export type ServiceOptions = Partial<Pick<ServiceSchema, Exclude<keyof ServiceSchema, ServiceOptionsToExclude>>>;

/* export interface ServiceConstructor {
  new (...args: any[]): Service;
} */
export type ServiceConstructor = new (...args: any[]) => MolecService;

export type ServiceDecorator = <T extends ServiceConstructor>(constructor: T) => T;

/**
 * Add all handlers to the schema for the service
 * @param options
 */
export const Service = <T extends Options>(opts?: T): ServiceDecorator => {
  // const options: ServiceOptions = opts || ({} as Options);
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

          // if (key === 'started' || key === 'stopped') {
          //   schema[key] = descriptor.value;
          //   return;
          // }

          if (['started', 'stopped'].includes(key)) {
            schema[key] = descriptor.value;
            return;
          }

          // if (key === 'events' || key === 'methods' || key === 'actions') {
          //   schema[key] ? Object.assign(Object(schema[key]), descriptor.value) : (schema[key] = descriptor.value);
          //   return;
          // }

          if (['events', 'methods', 'actions'].includes(key)) {
            if (schema[key]) {
              Object.assign(schema[key], descriptor.value);
            } else {
              schema[key] = descriptor.value;
            }
            return;
          }

          // moleculer-db lifecycle methods (https://github.com/ColonelBundy/moleculer-decorators/issues/2)
          // if (key === 'afterConnected' || key === 'entityCreated' || key === 'entityUpdated' || key === 'entityRemoved') {
          //   schema[key] = descriptor.value;
          // }
          if (['afterConnected', 'entityCreated', 'entityUpdated', 'entityRemoved'].includes(key)) {
            schema[key] = descriptor.value;
          }
        });
        const keys = getClassMetadata(constructor.prototype);
        // todo: below merges the two objects, we need a better merge to allow actions and methods to be merged when defined in service decorator
        const actions = schema.actions;
        schema = { ...schema, ...keys };
        if (schema.mergeActions && schema.actions) {
          console.log(actions);
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
// export const Service = <T extends Options>(options?: T | ServiceOptions): ServiceDecorator => {
//   return <T extends ServiceConstructor>(constructor: T) => {
//     if (isServiceClass(constructor)) {
//       // TODO: Filter options to remove actions, events, etc..
//       let schema: ServiceSchema = {
//         ...options,
//         // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//         name: options?.name || constructor.name,
//         ...defaultServiceOptions
//       };

//       try {
//         // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
//         const keys = getClassMetadata(constructor.prototype);
//         schema = { ...schema, ...keys };
//       } catch (ex: any) {
//         throw new DecoratorError('An error occured creating the service schema', ex as Error | undefined);
//       }

//       return class extends constructor {
//         constructor(...args: any[]) {
//           // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
//           super(...args);
//           this.parseServiceSchema(schema);
//         }
//       };
//     }
//     throw TypeError('Class must extend Service');
//   };
// };
