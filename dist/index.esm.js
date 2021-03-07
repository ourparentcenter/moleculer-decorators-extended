const getTag = (value) => {
  if (value == null) {
    return value === void 0 ? "[object Undefined]" : "[object Null]";
  }
  return toString.call(value);
};
const isObject = (value) => {
  const type = typeof value;
  return value != null && (type == "object" || type == "function");
};
const omit = (object, remove) => {
  const newObj = {...object};
  for (const n of remove) {
    delete newObj[n];
  }
  return newObj;
};
const isFunction = (value) => {
  if (!isObject(value)) {
    return false;
  }
  const tag = getTag(value);
  return ["[object Function]", "[object AsyncFunction]", "[object GeneratorFunction]", "[object Proxy]"].includes(tag);
};

const blacklist = ["created", "started", "stopped", "actions", "methods", "events", "broker", "logger"];
const blacklist2 = ["metadata", "settings", "mixins", "name", "version"].concat(blacklist);
const defaultServiceOptions = {
  constructOverride: true,
  skipHandler: false
};
const mockServiceBroker = {Promise};
const serviceDescriptorConstructor = (parentService, base, vars) => {
  const ServiceClass = new parentService.constructor(mockServiceBroker);
  Object.getOwnPropertyNames(ServiceClass).forEach((key) => {
    if (!blacklist.includes(key) && isFunction(ServiceClass[key])) {
      if (base.hasOwnProperty(key))
        base[key] = Object.getOwnPropertyDescriptor(ServiceClass, key).value;
      if (!blacklist2.includes(key)) {
        if (vars.hasOwnProperty(key))
          vars[key] = Object.getOwnPropertyDescriptor(ServiceClass, key).value;
      }
    }
  });
  const bypass = Object.defineProperty;
  const obj = {};
  bypass(obj, "created", {
    value: function created(broker) {
      for (const key in vars) {
        if (Object.prototype.hasOwnProperty.call(vars, key)) {
          this[key] = vars[key];
        }
      }
      const ownPropertyDescriptor = Object.getOwnPropertyDescriptor(parentService, "created");
      if (ownPropertyDescriptor) {
        ownPropertyDescriptor.value.call(this, broker);
      }
    },
    writable: true,
    enumerable: true,
    configurable: true
  });
  base["created"] = obj.created;
};
const Method = (target, key, descriptor) => {
  (target.methods || (target.methods = {}))[key] = descriptor.value;
};
const Event = (options) => {
  return function(target, key, descriptor) {
    (target.events || (target.events = {}))[key] = options ? {
      ...options,
      handler: descriptor.value
    } : descriptor.value;
  };
};
const Action = (options = {}) => {
  return function(target, key, descriptor) {
    if (!options.skipHandler) {
      options.handler = descriptor.value;
    } else {
      delete options.skipHandler;
    }
    (target.actions || (target.actions = {}))[key] = {...options};
  };
};
const Service = (opts) => {
  const options = opts || {};
  return function(constructor) {
    const base = {
      name: ""
    };
    const _options = {...defaultServiceOptions, ...options};
    Object.defineProperty(base, "name", {
      value: options.name || constructor.name,
      writable: false,
      enumerable: true
    });
    if (options.name) {
      delete options.name;
    }
    Object.assign(base, omit(options, Object.keys(defaultServiceOptions)));
    const parentService = constructor.prototype;
    const vars = {};
    Object.getOwnPropertyNames(parentService).forEach(function(key) {
      if (key === "constructor") {
        if (_options.constructOverride) {
          serviceDescriptorConstructor(parentService, base, vars);
        }
        return;
      }
      const descriptor = Object.getOwnPropertyDescriptor(parentService, key);
      if (key === "created" && !_options.constructOverride) {
        base[key] = descriptor.value;
      }
      if (key === "started" || key === "stopped") {
        base[key] = descriptor.value;
        return;
      }
      if (key === "events" || key === "methods" || key === "actions") {
        base[key] ? Object.assign(base[key], descriptor.value) : base[key] = descriptor.value;
        return;
      }
      if (key === "afterConnected" || key === "entityCreated" || key === "entityUpdated" || key === "entityRemoved") {
        base[key] = descriptor.value;
      }
    });
    return class extends parentService.constructor {
      constructor(broker, schema) {
        super(broker, schema);
        this.parseServiceSchema(base);
      }
    };
  };
};

const Get = (path, options) => {
  const opts = {
    ...options || {},
    rest: `GET ${path}`
  };
  return Action(opts);
};
const Post = (path, options) => {
  const opts = {
    ...options || {},
    rest: `POST ${path}`
  };
  return Action(opts);
};
const Put = (path, options) => {
  const opts = {
    ...options || {},
    rest: `PUT ${path}`
  };
  return Action(opts);
};
const Patch = (path, options) => {
  const opts = {
    ...options || {},
    rest: `PATCH ${path}`
  };
  return Action(opts);
};
const Delete = (path, options) => {
  const opts = {
    ...options || {},
    rest: `DELETE ${path}`
  };
  return Action(opts);
};

export { Action, Delete, Event, Get, Method, Patch, Post, Put, Service };
