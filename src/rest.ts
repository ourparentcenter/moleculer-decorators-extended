/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Action, ActionOptions } from './basic';

// export function Get<T extends ActionOptions>(path: string, options?: T) {
const Get = <T extends ActionOptions>(path: string, options?: T) => {
  const opts = {
    ...(options || {}),
    rest: `GET ${path}`
  };
  return Action(opts);
};

const Post = <T extends ActionOptions>(path: string, options?: T) => {
  const opts = {
    ...(options || {}),
    rest: `POST ${path}`
  };
  return Action(opts);
};

const Put = <T extends ActionOptions>(path: string, options?: T) => {
  const opts = {
    ...(options || {}),
    rest: `PUT ${path}`
  };
  return Action(opts);
};

const Patch = <T extends ActionOptions>(path: string, options?: T) => {
  const opts = {
    ...(options || {}),
    rest: `PATCH ${path}`
  };
  return Action(opts);
};

const Delete = <T extends ActionOptions>(path: string, options?: T) => {
  const opts = {
    ...(options || {}),
    rest: `DELETE ${path}`
  };
  return Action(opts);
};
export { Get, Post, Put, Patch, Delete };
