import { Action, ActionOptions } from './actions';

// export function Get<T extends ActionOptions>(path: string, options?: T) {
export const Get = <T extends ActionOptions>(path: string, options?: T) => {
  const opts = {
    ...(options || {}),
    rest: `GET ${path}`
  };
  return Action(opts);
};

export const Post = <T extends ActionOptions>(path: string, options?: T) => {
  const opts = {
    ...(options || {}),
    rest: `POST ${path}`
  };
  return Action(opts);
};

export const Put = <T extends ActionOptions>(path: string, options?: T) => {
  const opts = {
    ...(options || {}),
    rest: `PUT ${path}`
  };
  return Action(opts);
};

export const Patch = <T extends ActionOptions>(path: string, options?: T) => {
  const opts = {
    ...(options || {}),
    rest: `PATCH ${path}`
  };
  return Action(opts);
};

export const Delete = <T extends ActionOptions>(path: string, options?: T) => {
  const opts = {
    ...(options || {}),
    rest: `DELETE ${path}`
  };
  return Action(opts);
};

export const OptionsVerb = <T extends ActionOptions>(path: string, options?: T) => {
  const opts = {
    ...(options || {}),
    rest: `OPTIONS ${path}`
  };
  return Action(opts);
};

export const Head = <T extends ActionOptions>(path: string, options?: T) => {
  const opts = {
    ...(options || {}),
    rest: `HEAD ${path}`
  };
  return Action(opts);
};

export const Connect = <T extends ActionOptions>(path: string, options?: T) => {
  const opts = {
    ...(options || {}),
    rest: `CONNECT ${path}`
  };
  return Action(opts);
};

export const Trace = <T extends ActionOptions>(path: string, options?: T) => {
  const opts = {
    ...(options || {}),
    rest: `TRACE ${path}`
  };
  return Action(opts);
};
