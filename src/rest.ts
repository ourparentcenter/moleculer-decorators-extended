import { Action, ActionOptions } from './basic';

export function Get<T extends ActionOptions>(path: string, options?: T) {
  const opts = {
    ...(options || {}),
    rest: `GET ${path}`
  };
  return Action(opts);
}

export function Post<T extends ActionOptions>(path: string, options?: T) {
  const opts = {
    ...(options || {}),
    rest: `POST ${path}`
  };
  return Action(opts);
}

export function Put<T extends ActionOptions>(path: string, options?: T) {
  const opts = {
    ...(options || {}),
    rest: `PUT ${path}`
  };
  return Action(opts);
}

export function Patch<T extends ActionOptions>(path: string, options?: T) {
  const opts = {
    ...(options || {}),
    rest: `PATCH ${path}`
  };
  return Action(opts);
}

export function Delete<T extends ActionOptions>(path: string, options?: T) {
  const opts = {
    ...(options || {}),
    rest: `DELETE ${path}`
  };
  return Action(opts);
}
