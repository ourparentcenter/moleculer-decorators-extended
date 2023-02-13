export const additionalServiceRoutes = [
  {
    path: '/v1/greeter',
    aliases: {
      'GET hi': 'v1.greeter.hi',
      'GET hello': 'v1.greeter.hello',
      'POST welcome/:name': 'v1.greeter.welcome'
    },
    // cors: {
    //   origin: ['*'],
    //   methods: ['GET', 'POST'],
    //   credentials: false,
    //   maxAge: 3600
    // },
    whitelist: [
      // Access to any actions in service under "/api/v1/greeter" URL
      '**'
    ],
    // Enable authentication. Implement the logic into `authenticate` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authentication
    authentication: false,

    // Enable authorization. Implement the logic into `authorize` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authorization
    authorization: false,
    autoAliases: false,

    bodyParsers: {
      json: true
    }
  },
  {
    path: '/v2/greeter2',
    aliases: {
      'GET hi2': 'v2.greeter2.hi2',
      'GET hello': 'v2.greeter2.hello',
      'POST welcome/:name': 'v2.greeter2.welcome'
    },
    // cors: {
    //   origin: ['*'],
    //   methods: ['GET', 'POST'],
    //   credentials: false,
    //   maxAge: 3600
    // },
    whitelist: [
      // Access to any actions in service under "/api/v1/greeter" URL
      '**'
    ],
    // Enable authentication. Implement the logic into `authenticate` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authentication
    authentication: false,

    // Enable authorization. Implement the logic into `authorize` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authorization
    authorization: false,
    autoAliases: false,

    bodyParsers: {
      json: true
    }
  }
];
