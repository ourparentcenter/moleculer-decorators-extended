import { Action, ActionOptions } from './actions';

export const Checkout = <T extends ActionOptions>(path: string, options?: T) => {
  const opts = {
    ...(options ?? {}),
    rest: `CHECKOUT ${path}`
  };
  return Action(opts);
};

export const Connect = <T extends ActionOptions>(path: string, options?: T) => {
  const opts = {
    ...(options ?? {}),
    rest: `CONNECT ${path}`
  };
  return Action(opts);
};

export const Copy = <T extends ActionOptions>(path: string, options?: T) => {
  const opts = {
    ...(options ?? {}),
    rest: `COPY ${path}`
  };
  return Action(opts);
};

export const Delete = <T extends ActionOptions>(path: string, options?: T) => {
  const opts = {
    ...(options ?? {}),
    rest: `DELETE ${path}`
  };
  return Action(opts);
};

export const Get = <T extends ActionOptions>(path: string, options?: T) => {
  const opts = {
    ...(options ?? {}),
    rest: `GET ${path}`
  };
  return Action(opts);
};

export const Head = <T extends ActionOptions>(path: string, options?: T) => {
  const opts = {
    ...(options ?? {}),
    rest: `HEAD ${path}`
  };
  return Action(opts);
};

export const Lock = <T extends ActionOptions>(path: string, options?: T) => {
  const opts = {
    ...(options ?? {}),
    rest: `LOCK ${path}`
  };
  return Action(opts);
};

export const Merge = <T extends ActionOptions>(path: string, options?: T) => {
  const opts = {
    ...(options ?? {}),
    rest: `MERGE ${path}`
  };
  return Action(opts);
};

export const MKActivity = <T extends ActionOptions>(path: string, options?: T) => {
  const opts = {
    ...(options ?? {}),
    rest: `MKACTIVITY ${path}`
  };
  return Action(opts);
};

export const MKCol = <T extends ActionOptions>(path: string, options?: T) => {
  const opts = {
    ...(options ?? {}),
    rest: `MKCOL ${path}`
  };
  return Action(opts);
};

export const Move = <T extends ActionOptions>(path: string, options?: T) => {
  const opts = {
    ...(options ?? {}),
    rest: `MOVE ${path}`
  };
  return Action(opts);
};

export const MSearch = <T extends ActionOptions>(path: string, options?: T) => {
  const opts = {
    ...(options ?? {}),
    rest: `M-SEARCH ${path}`
  };
  return Action(opts);
};

export const Notify = <T extends ActionOptions>(path: string, options?: T) => {
  const opts = {
    ...(options ?? {}),
    rest: `NOTIFY ${path}`
  };
  return Action(opts);
};

export const OptionsVerb = <T extends ActionOptions>(path: string, options?: T) => {
  const opts = {
    ...(options ?? {}),
    rest: `OPTIONS ${path}`
  };
  return Action(opts);
};

export const Patch = <T extends ActionOptions>(path: string, options?: T) => {
  const opts = {
    ...(options ?? {}),
    rest: `PATCH ${path}`
  };
  return Action(opts);
};

export const Post = <T extends ActionOptions>(path: string, options?: T) => {
  const opts = {
    ...(options ?? {}),
    rest: `POST ${path}`
  };
  return Action(opts);
};

export const Purge = <T extends ActionOptions>(path: string, options?: T) => {
  const opts = {
    ...(options ?? {}),
    rest: `PURGE ${path}`
  };
  return Action(opts);
};

export const Put = <T extends ActionOptions>(path: string, options?: T) => {
  const opts = {
    ...(options ?? {}),
    rest: `PUT ${path}`
  };
  return Action(opts);
};

export const Report = <T extends ActionOptions>(path: string, options?: T) => {
  const opts = {
    ...(options ?? {}),
    rest: `REPORT ${path}`
  };
  return Action(opts);
};

export const Search = <T extends ActionOptions>(path: string, options?: T) => {
  const opts = {
    ...(options ?? {}),
    rest: `SEARCH ${path}`
  };
  return Action(opts);
};

export const Subscribe = <T extends ActionOptions>(path: string, options?: T) => {
  const opts = {
    ...(options ?? {}),
    rest: `SUBSCRIBE ${path}`
  };
  return Action(opts);
};

export const Trace = <T extends ActionOptions>(path: string, options?: T) => {
  const opts = {
    ...(options ?? {}),
    rest: `TRACE ${path}`
  };
  return Action(opts);
};

export const Unlock = <T extends ActionOptions>(path: string, options?: T) => {
  const opts = {
    ...(options ?? {}),
    rest: `UNLOCK ${path}`
  };
  return Action(opts);
};

export const Unsubscribe = <T extends ActionOptions>(path: string, options?: T) => {
  const opts = {
    ...(options ?? {}),
    rest: `UNSUBSCRIBE ${path}`
  };
  return Action(opts);
};
