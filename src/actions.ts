/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { /* ActionHandler, */ ActionSchema, Context } from 'moleculer';
import { isFunction, getMetadata, removeMetadata, setMetadata, getParamNames } from './utils';

export interface ActionOptions {
  name?: ActionSchema['name'];
  cache?: ActionSchema['cache'];
  metrics?: ActionSchema['metrics'];
  params?: ActionSchema['params'];
  [key: string]: any;
}

export const Action = (options?: ActionOptions): MethodDecorator => {
  return <T>(target: object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => {
    const func: any = descriptor.value;
    if (func && isFunction(func)) {
      const keyName: string = propertyKey.toString();
      const opts: ActionOptions = { name: keyName, ...options };
      const actions: any = getMetadata(target, 'actions') || {};
      const params = getMetadata(target, `${keyName}Params`);
      const contextParam: any = getMetadata(target, `${keyName}Context`);
      const metaParam: any = getMetadata(target, `${keyName}Meta`);
      if (!(opts.params || !params)) {
        descriptor.value = ((ctx: Context<any>) => {
          const args = getParamNames(func).map((param) => {
            return ctx.params[param];
          });

          if (contextParam) {
            args.splice(contextParam.index, 0, ctx);
          }

          if (metaParam) {
            args.splice(metaParam.index, 0, ctx.meta);
          }

          return (func as Function).call(ctx.service, ...args);
        }) as any;
      }
      const handler = descriptor.value;

      if (params) {
        opts.params = params;
      }

      actions[propertyKey] = {
        handler,
        ...opts
      };
      setMetadata(target, 'actions', actions);
      removeMetadata(target, `${keyName}Params`);

      return descriptor;
    } else {
      throw new TypeError('An action must be a function/method');
    }
  };
};
