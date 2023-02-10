'use strict';

import { Errors, ServiceBroker } from 'moleculer';
import TestService from '../services/greeter2.service';
import 'jest-extended';
import 'jest-chain';
const JEST_TIMEOUT = 35 * 1000;
jest.setTimeout(JEST_TIMEOUT);

describe("Test 'greeter' service with mergeActions set to false", () => {
  const broker = new ServiceBroker({ logger: false });
  broker.createService(TestService);

  beforeAll(async () => {
    await broker.start();
  });
  afterAll(async () => await broker.stop());

  describe("Test 'v2.greeter.hello' GET action", () => {
    it("should return with 'Hello Moleculer'", async () => {
      const res = await broker.call('v2.greeter.hello');
      expect(res).toBe('Hello Moleculer');
    });
  });

  describe("Test 'v2.greeter' hi action with mergeActions set to false", () => {
    it('should return with error', async () => {
      try {
        await broker.call('v2.greeter.hi');
      } catch (err) {
        expect(err)
          .toBeDefined()
          .toBeObject()
          .toContainEntries([
            ['code', 404],
            ['type', 'SERVICE_NOT_FOUND'],
            ['data', { action: 'v2.greeter.hi' }]
          ]);
      }
    });
  });

  describe("Test 'v2.greeter.welcome' POST action", () => {
    it("should return with 'Welcome'", async () => {
      const res = await broker.call('v2.greeter.welcome', { name: 'Adam' });
      expect(res).toBe('Welcome, Adam');
    });

    it('should reject an ValidationError', async () => {
      expect.assertions(1);
      try {
        await broker.call('v2.greeter.welcome');
      } catch (err) {
        expect(err).toBeInstanceOf(Errors.ValidationError);
      }
    });
  });
});
