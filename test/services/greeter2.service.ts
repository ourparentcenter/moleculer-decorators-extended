"use strict";
import moleculer, { Context } from "moleculer";
import {
  Get,
  Method,
  Post,
  Service,
  ServiceStarted,
  ServiceStopped,
} from "../../src";
import { GreeterWelcomeParams } from "../../types";
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
@Service({
  name: "greeter",
  version: 2,
  mergeActions: false,
  /**
   * Settings
   */
  settings: {
    idField: "_id",
    // Available fields in the responses
    fields: ["_id", "name", "quantity", "price"],
    // Base path
    rest: "/",
    // Validator for the `create` & `insert` actions.
    entityValidator: {
      name: "string|min:3",
    },
  },
  actions: {
    hi() {
      return this.sayHello();
    },
  },
  methods: {
    sayHello() {
      return "Hello from service method";
    },
  },
})
export default class GreeterService extends moleculer.Service {
  @Get("/hello", {
    name: "hello",
  })
  async hello() {
    return "Hello Moleculer";
  }

  @Post("/welcome", {
    name: "welcome",
    params: {
      name: "string",
    },
  })
  async welcome(ctx: Context<GreeterWelcomeParams, Record<string, unknown>>) {
    return `Welcome, ${ctx.params.name}`;
  }

  @Method
  async test() {
    return "Decorator method!!!";
  }

  async started() {
    this.logger.info(
      "♻ Greeter service started core moleculer started, ready for connections"
    );
  }

  @ServiceStarted()
  serviceGreeterStarted() {
    this.logger.info("♻ Greeter service started, ready for connections");
  }

  @ServiceStopped()
  serviceGreeterStopped() {
    this.logger.info("♻ Greeter service stopped, connections terminated");
  }
}
