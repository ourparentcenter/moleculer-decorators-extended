![Moleculer logo](https://raw.githubusercontent.com/ice-services/moleculer/HEAD/docs/assets/logo.png)


[![npm](https://img.shields.io/npm/v/@ourparentcenter/moleculer-decorators-extended.svg)](https://www.npmjs.com/package/@ourparentcenter/moleculer-decorators-extended) 
[![GitHub issues](https://img.shields.io/github/issues/d0whc3r/moleculer-decorators.svg)](https://github.com/ourparentcenter/moleculer-decorators-extended/issues) 
[![GitHub license](https://img.shields.io/github/license/d0whc3r/moleculer-decorators.svg)](https://github.com/ourparentcenter/moleculer-decorators-extended/blob/master/LICENSE)
[![Powered by moleculer](https://img.shields.io/badge/Powered%20by-Moleculer-green.svg?colorB=0e83cd)](http://moleculer.services/)
# Moleculer Decorators
> Decorators for moleculer, Tested & accurate as of 0.14



## Available options
```js
constructOverride: false // True by default, This will override any properties defined in @Service if defined in the constructor as well.
skipHandler: true // false by default, this will let a mixin override the handler in an action. (action options)
mergeActions: true // false by default, this will merge actions defined in `@Service` decorator options with class `@Action` decorator. (action options)
```
> These are defined in @Service

## mergeActions
The intention of mergeActions is to facilitate the migration of actions in the Service schema to `@Action` class decorator. The default value is `false` and when set to `true` it will merge the `@Service` actions with those found in class decorated with `@Action`. Since the merge is done after the decorator is applied to actions tag of the schema, if an action name in @Service options is the same as that found in the class decorated with `@Action`, then the `@Service` options action will overwrite that of `@Action` in the schema.
> To swap between the service option actions and class actions, toggle mergeActions to true to see results of service options actions and false to see results of decorator actions. Only actions that do not have the same name as thier class counterparts will be merged and available when the toggle is set to true.
# Example usage

```js
const moleculer = require('moleculer');
const { Service, Action, Event, Method, Get, Post, Put, Patch, Delete } = require('@ourparentcenter/moleculer-decorators-extended');
const web = require('moleculer-web');
const broker = new moleculer.ServiceBroker({
  logger: console,
  logLevel: "debug",
});

@Service({
  mixins: [web],
  mergeActions: true,
  settings: {
    port: 3000,
    routes: [
      ...
    ]
  },
  actions: {...}
})
class ServiceName extends moleculer.Service {

  // Optional constructor
  constructor() {
    this.settings = { // Overrides above by default, to prevent this, add "constructOverride: false" to @Service
      port: 3001
    }
  }

  // Without constructor (typescript)
  settings = {
    port: 3001
  }

  @Action()
  Login(ctx) {
    ...
  }

  @Action({
    skipHandler: true // Any options will be merged with the mixin's action.
  })
  Login3() { // this function will never be called since a mixin will override it, unless you specify skipHandler: false.

  }

  // With options
  // No need for "handler:{}" here
  @Action({
    cache: false,
    params: {
      a: "number",
      b: "number"
    }
  })
  Login2(ctx) {
    ...
  }

  // Get, Post, Put, Patch, Delete follow the same syntax below
  @Get('/user', {
    params: {
      id: "string"
    }
  })
  getUser(ctx) {
      ...
  }

  @Event({
    group: 'group_name'
  })
  'event.name'(payload, sender, eventName) {
    ...
  }

  @Event()
  'event.name'(payload, sender, eventName) {
    ...
  }

  @Method
  authorize(ctx, route, req, res) {
    ...
  }

  @ServiceCreated() { // Passes to moleculer created lifecycle, fired when created
    ...
  }

  @ServiceMerged() { // Passes to moleculer merged lifecycle, Fired after the service schemas merged and before the service instance created
    ...
  }

  @ServiceStarted() { // Passes to moleculer started lifecycle, fired when started
    ...
  }

  @ServiceStopped() { // Passes to moleculer stopped lifecycle, fired when stopped
    ...
  }
}

broker.createService(ServiceName);
broker.start();
```

# Usage with moleculer-runner
Simply export the service instead of starting a broker manually.    
> It must be a commonjs module.
```js 
  module.exports = ServiceName 
``` 

## Usage with custom ServiceFactory class
Moleculer allows you to define your own ServiceFactory class, from which your services should inherit. 
> All you have to do, is pass your custom ServiceFactory to broker options and also extend your services from this class 
```js
const moleculer = require('moleculer');
const { Service, Action } = require('@ourparentcenter/moleculer-decorators-extended');

// create new service factory, inheriting from moleculer native Service
class CustomService extends moleculer.Service {
    constructor(broker, schema) {
        super(broker, schema)
    }

    foo() {
        return 'bar';
    }
}

// pass your custom service factory to broker options
const broker = new moleculer.ServiceBroker({
  ServiceFactory: CustomService
});

@Service()
class ServiceName extends CustomService { // extend your service from your custom service factory
  @Action()
  Bar(ctx) {
    return this.foo();
  }
}

broker.createService(CustomService);
broker.start();
```

## Service
The `Service` class must be used as the base of any decorated service. Most options can be added either by defining them in the class itself or by adding them to the decorator options.
```js
@Service()
class Example extends Service {
    version = 1;
    settings = {};
    metadata = {
        test: "This is a test"
    };
    mixins = [];
}
```
```js
class Base extends Service {}

@Service({
    name: "Tester",
    version: 1,
    settings: {},
    metadata: {
        test: "This is a test"
    },
    mixins: []
})
class Example2 extends Base {
}
```

## Parameters
Param decorators for [Fastest Validator](https://github.com/icebob/fastest-validator) are provided and creating custom param decorators is easy.

> This example assumes using the [Joi Validator example](https://gist.github.com/icebob/07024c0ac22589a5496473c2a8a91146)
```ts
import * as Joi from "joi";
import { Service } from "moleculer";

import {
    action,
    param,
    service
} from "moleculer-service-decorators";

function joiString() {
    return param(Joi.string().max(255).required());
}

@Service()
class Example extends Service {
    @Action()
    public help(@joiString() text: string) {}
}
```

## Actions
Actions can have options set in the same format as the `ServiceSchema`. The handler can be defined with the parameters of the context or you can set the parameters in the action options and use a `Context` as the only parameter to the handler.
```ts
import { Service } from "moleculer";

@Service()
class Example extends Service {
    @Action({
        name: "getHelp",
        cache: true,
        metrics: { params: false, meta: true }
    })
    public help(@string() text: string) {}
}

@Service()
class Example2 extends Service {
    @Action({
        name: "getHelp",
        cache: true,
        metrics: { params: false, meta: true },
        params: {
            text: "string"
        }
    })
    public help(ctx: Context) {}
}
```

## Events
Event handlers are added easily with options available to make it more flexible.
```ts
import { Service } from "moleculer";

@Service()
class Example extends Service {
    @Event()
    public "test.started"(payload: any, sender: string, eventName: string) {}

    @Event({ name: "test.ended", group: "test" })
    public testEnded(payload: any, sender: string, eventName: string) {}
}
```

## Rest
Rest actions make adding api endpoints easy. The current rest methods are <b>`GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD, CONNECT, TRACE`</b>.
```ts
import { Service } from "moleculer";

@Service()
class Example extends Service {
    @Get('/logout', {
		name: 'logout',
		restricted: ['api'],
	})
	logout(ctx: Context<Record<string, unknown>, UserAuthMeta>) {
		...
	}

    @Post('/', {
		name: 'create',
		roles: UserRole.SUPERADMIN,
		restricted: ['api'],
		params: {
			...validateUserBase,
			password: 'string',
			requireRegToken: { type: 'boolean', optional: true },
		},
	})
	async createUser(ctx: Context<UserCreateParams, UserAuthMeta>) {
		...
	}

    @Put('/:id', {
		name: 'modify',
		restricted: ['api', 'user'],
		roles: UserRole.SUPERADMIN,
		params: {
			...validateUserBaseOptional,
			password: { type: 'string', optional: true },
			id: 'string',
		},
	})
	async modifyUser(ctx: Context<UserUpdateParams, UserAuthMeta>) {
		...
	}

    @Patch('/:id', {
		name: 'update',
		restricted: ['api', 'user'],
		roles: UserRole.SUPERADMIN,
		params: {
			...validateUserBaseOptional,
			password: { type: 'string', optional: true },
			id: 'string',
		},
	})
	async updateUser(ctx: Context<UserUpdateParams, UserAuthMeta>) {
		...
	}

    @Delete('/:id', {
		name: 'remove',
		restricted: ['api'],
		roles: UserRole.SUPERADMIN,
		params: { id: 'string' },
	})
	async deleteUser(ctx: Context<UserDeleteParams, UserAuthMeta>) {
		...
	}
}
```

## Lifecycle events
Event handlers are added easily with options available to make it more flexible.
```ts
import { Service } from "moleculer";

@Service()
class Example extends Service {
    @ServiceCreated()
    public createdMethod() {
        this.logger.info('Service created')
    }

    @ServiceMerged()
    public mergedMethod() {
        this.logger.info('Service schema merged')
    }

    @ServiceStarted()
    public startedMethod() {
        this.logger.info('Service started')
    }

    @ServiceStopped()
    public stoppedMethod() {
        this.logger.info('Service stopped')
    }
}
```

# License
Moleculer Decorators is available under the [MIT license](https://tldrlegal.com/license/mit-license).
