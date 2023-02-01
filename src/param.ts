import { getMetadata, setMetadata } from './utils/metadata';
import { getParamNames } from './utils/parameters';

export interface ParamTypeOptions {
  name?: string;
  optional?: boolean;
}

export interface ParamOptions extends ParamTypeOptions {
  type?: any;
  [key: string]: any;
}

const paramError = 'Parameter name not specified';

/**
 * Create the parameter definition for the service action
 * @param {ParamOptions} options
 */
export const param = ({ name, type, ...options }: ParamOptions): ParameterDecorator => {
  return (target: object, propertyKey: string | symbol, parameterIndex: number) => {
    const desc = Object.getOwnPropertyDescriptor(target, propertyKey) || {};
    const actionParams = getMetadata(target, `${propertyKey.toString()}Params`) || {};
    let validation: unknown;

    let paramName: string;
    if (name) {
      paramName = name;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      paramName = getParamNames(desc.value)[parameterIndex];
    }

    if (!paramName) {
      throw new ReferenceError(paramError);
    }

    if (type && typeof type === 'string') {
      validation = { type, ...options };
    } else {
      validation = type;
    }

    const params = {
      ...actionParams,
      [paramName]: validation
    };

    setMetadata(target, `${propertyKey.toString()}Params`, params);
  };
};

/**
 * Add the action Context to the parameter when the action is executed
 */
export const context = (name?: string): ParameterDecorator => {
  return (target: object, propertyKey: string | symbol, parameterIndex: number) => {
    const desc = Object.getOwnPropertyDescriptor(target, propertyKey) || {};
    let paramName: string;

    if (name) {
      paramName = name;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      paramName = getParamNames(desc.value)[parameterIndex];
    }

    if (!paramName) {
      throw new ReferenceError(paramError);
    }

    setMetadata(target, `${propertyKey.toString()}Context`, { paramName, index: parameterIndex });
  };
};

/**
 * Add the Context Metadata to the parameter when the action is executed
 */
export const meta = (name?: string): ParameterDecorator => {
  return (target: object, propertyKey: string | symbol, parameterIndex: number) => {
    const desc = Object.getOwnPropertyDescriptor(target, propertyKey) || {};
    let paramName: string;

    if (name) {
      paramName = name;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      paramName = getParamNames(desc.value)[parameterIndex];
    }

    if (!paramName) {
      throw new ReferenceError(paramError);
    }

    setMetadata(target, `${propertyKey.toString()}Meta`, { paramName, index: parameterIndex });
  };
};

/**
 * Fastest Validator implementation of the `any` type
 * @param {ParamTypeOptions} options The name of the param and whether it is required
 */
export const any = ({ optional, name }: ParamTypeOptions) => {
  return param({ type: 'any', optional, name });
};

/**
 * Options for the Array parameter type
 */
export interface ArrayParamOptions extends ParamTypeOptions {
  contains?: any;
  empty?: boolean;
  enum?: any[]; // Should this be limited to `string | number | boolean` primitives?
  length?: number;
  min?: number;
  max?: number;
  items?: ParamOptions | ParamOptions[];
}

/**
 * Fastest Validator implementation of the `array` type
 * @param {ArrayParamOptions} options
 */
export const array = (options?: ArrayParamOptions) => {
  return param({ ...options, type: 'array' });
};

/**
 * Options for the Boolean parameter type
 */
export interface BooleanParamOptions extends ParamTypeOptions {
  convert?: boolean;
}

/**
 * Fastest Validator implementation of the `boolean` type
 * @param {BooleanParamOptions} options
 */
export const boolean = (options?: BooleanParamOptions) => {
  return param({ ...options, type: 'boolean' });
};

/**
 * Options for the Date parameter type
 */
export interface DateParamOptions extends ParamTypeOptions {
  convert?: boolean;
}

/**
 * Fastest Validator implementation of the `date` type
 * @param {DateParamOptions} options
 */
export const date = (options?: DateParamOptions) => {
  return param({ ...options, type: 'date' });
};

/**
 * Options for the Email parameter type
 */
export interface EmailParamOptions extends ParamTypeOptions {
  mode?: 'quick' | 'precise';
}

/**
 * Fastest Validator implementation of the `email` type
 * @param {EmailParamOptions} options
 */
export const email = (options?: EmailParamOptions) => {
  return param({ ...options, type: 'email' });
};

/**
 * Options for the Forbidden parameter type
 */
export interface ForbiddenParamOptions {
  name?: string;
}

/**
 * Fastest Validator implementation of the `forbidden` type
 * @param {ForbiddenParamOptions} options
 */
export const forbidden = (options?: ForbiddenParamOptions) => {
  return param({ ...options, type: 'forbidden' });
};

/**
 * Options for the Number parameter type
 */
export interface NumberParamOptions extends ParamTypeOptions {
  min?: number;
  max?: number;
  equal?: number;
  notEqual?: number;
  integer?: boolean;
  positive?: boolean;
  negative?: boolean;
  convert?: boolean;
}

/**
 * Fastest Validator implementation of the `number` type
 * @param {NumberParamOptions} options
 */
export const number = (options?: NumberParamOptions) => {
  return param({ ...options, type: 'number' });
};

/**
 * Fastest Validator implementation of the `object` type
 * @param {ParamTypeOptions} options
 */
export const object = (options?: ParamTypeOptions) => {
  return param({ ...options, type: 'object' });
};

/**
 * Options for the String parameter type
 */
export interface StringParamOptions extends ParamTypeOptions {
  contains?: string;
  enum?: number[];
  empty?: boolean;
  length?: number;
  pattern?: string | RegExp;
  min?: number;
  max?: number;
}

/**
 * Fastest Validator implementation of the `string` type
 * @param {StringParamOptions} options
 */
export const string = (options?: StringParamOptions) => {
  return param({ ...options, type: 'string' });
};

/**
 * Fastest Validator implementation of the `url` type
 * @param {ParamTypeOptions} options
 */
export const url = (options?: ParamTypeOptions) => {
  return param({ ...options, type: 'url' });
};
