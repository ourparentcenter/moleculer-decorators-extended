"use strict";

import { Errors, ServiceBroker } from "moleculer";
import TestService from "../services/greeter.service";
import "jest-extended";
import "jest-chain";
const JEST_TIMEOUT = 35 * 1000;
jest.setTimeout(JEST_TIMEOUT);

describe("Test 'greeter' service with mergeActions set to true", () => {
  const broker = new ServiceBroker({ logger: false });
  broker.createService(TestService);

  beforeAll(() => {
    broker.start();
  });
  afterAll(() => broker.stop());

  describe("Test 'v1.greeter.hello' GET action", () => {
    it("should return with 'Hello Moleculer'", async () => {
      const res = await broker.call("v1.greeter.hello");
      expect(res).toBe("Hello Moleculer");
    });
  });

  describe("Test 'v1.greeter' hi action with mergeActions set to true", () => {
    it("should return with 'Hello from service method'", async () => {
      const res = await broker.call("v1.greeter.hi");
      expect(res).toBe("Hello from service method");
    });
  });

  describe("Test 'v1.greeter.welcome' POST action", () => {
    it("should return with 'Welcome'", async () => {
      const res = await broker.call("v1.greeter.welcome", { name: "Adam" });
      expect(res).toBe("Welcome, Adam");
    });

    it("should reject an ValidationError", async () => {
      expect.assertions(1);
      try {
        await broker.call("v1.greeter.welcome");
      } catch (err) {
        expect(err).toBeInstanceOf(Errors.ValidationError);
      }
    });
  });
});
