'use strict';

import { ServiceBroker } from 'moleculer';
import api from '../services/api/api.service';
import TestService from '../services/greeter.service';
import TestService2 from '../services/greeter2.service';
import request from 'supertest';
import 'jest-extended';
import 'jest-chain';
const JEST_TIMEOUT = 35 * 1000;
jest.setTimeout(JEST_TIMEOUT);

describe("Test 'v1.greeter && v2.greeter2' services with mergeActions", () => {
  const broker = new ServiceBroker({ logger: false });
  const apiService = broker.createService(api);
  const greeter = broker.createService(TestService);
  const greeter2 = broker.createService(TestService2);
  let schema;

  beforeAll(async () => {
    await broker.start();
    await broker.waitForServices([
      `${apiService.name}`,
      `v${String(greeter.version)}.${greeter.name}`,
      `v${String(greeter2.version)}.${greeter2.name}`
    ]);
  });
  afterAll(async () => await broker.stop());

  describe(`Test 'v${String(greeter.version)}.${greeter.name}' GET action`, () => {
    it("should return with 'Hello Moleculer'", async () => {
      const res = await request(apiService.server).get('/v1/greeter/hello');
      expect(res)
        .toBeDefined()
        .toBeObject()
        .toContainEntries([
          ['status', 200],
          ['text', '"Hello Moleculer"']
        ]);
    });
  });

  describe(`Test 'v${String(greeter.version)}.${greeter.name}' schema action with mergeActions set to true`, () => {
    it('should have hi action in schema', async () => {
      schema = greeter;
      expect(schema.actions).toBeDefined().toBeObject().toHaveProperty('hi');
    });
  });

  describe(`Test 'v${String(greeter.version)}.${greeter.name}' hi action with mergeActions set to true`, () => {
    it("should return with 'Hello from service method'", async () => {
      const res = await request(apiService.server).get('/v1/greeter/hi');
      expect(res)
        .toBeDefined()
        .toBeObject()
        .toContainEntries([
          ['status', 200],
          ['text', '"Hello from service method"']
        ]);
    });
  });

  describe(`Test 'v${String(greeter.version)}.${greeter.name}' POST action`, () => {
    it("should return with 'Welcome'", async () => {
      const res = await request(apiService.server).post('/v1/greeter/welcome/Adam');
      expect(res)
        .toBeDefined()
        .toBeObject()
        .toContainEntries([
          ['status', 200],
          ['text', '"Welcome, Adam"']
        ]);
    });

    it('should reject an ValidationError', async () => {
      const res = await request(apiService.server).post('/v1/greeter/welcome');
      expect(res)
        .toBeDefined()
        .toBeObject()
        .toContainEntries([
          ['status', 404],
          ['text', '{"name":"NotFoundError","message":"Not found","code":404,"type":"NOT_FOUND"}']
        ]);
    });
  });

  describe(`Test 'v${String(greeter2.version)}.${greeter2.name}' GET action`, () => {
    it("should return with 'Hello Moleculer'", async () => {
      const res = await request(apiService.server).get('/v2/greeter2/hello');
      expect(res)
        .toBeDefined()
        .toBeObject()
        .toContainEntries([
          ['status', 200],
          ['text', '"Hello Moleculer"']
        ]);
    });
  });

  describe(`Test 'v${String(greeter2.version)}.${greeter2.name}' schema action with mergeActions set to false`, () => {
    it('should not have hi2 action in schema', async () => {
      schema = greeter2;
      expect(schema.actions).toBeDefined().toBeObject().not.toHaveProperty('hi2');
    });
  });

  describe(`Test 'v${String(greeter2.version)}.${greeter2.name}' hi2 action with mergeActions set to false`, () => {
    it('should return with error', async () => {
      const res = await request(apiService.server).get('/v2/greeter2/hi2');
      expect(res)
        .toBeDefined()
        .toBeObject()
        .toContainEntries([
          ['status', 503],
          ['text', '{"name":"ServiceUnavailableError","message":"Service unavailable","code":503}']
        ]);
    });
  });

  describe(`Test 'v${String(greeter2.version)}.${greeter2.name}' POST action`, () => {
    it("should return with 'Welcome'", async () => {
      const res = await request(apiService.server).post('/v2/greeter2/welcome/Eve');
      expect(res)
        .toBeDefined()
        .toBeObject()
        .toContainEntries([
          ['status', 200],
          ['text', '"Welcome, Eve"']
        ]);
    });

    it('should reject an ValidationError', async () => {
      const res = await request(apiService.server).post('/v2/greeter2/welcome');
      expect(res)
        .toBeDefined()
        .toBeObject()
        .toContainEntries([
          ['status', 404],
          ['text', '{"name":"NotFoundError","message":"Not found","code":404,"type":"NOT_FOUND"}']
        ]);
    });
  });
});
