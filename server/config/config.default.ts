import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1560410762654_9651';

  // add your egg config in here
  config.middleware = [];
  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };
  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true,
    },
    domainWhiteList: ['.hoolinks.com'],
  };

  config.cors = {
    credentials: true,
  };
  config.io = {
    init: {}, // passed to engine.io
    namespace: {
      '/': {
        connectionMiddleware: [],
        packetMiddleware: ['connection', 'packet'],
      },
      '/socket/directive': {
        // 指令中心
        connectionMiddleware: [],
        packetMiddleware: ['connection', 'packet'],
      },
    },
  };
  config.swaggerdoc = {
    dirScanner: './app/controller',
    apiInfo: {
      title: 'egg-swagger',
      description: 'swagger-ui for egg',
      version: '2.0.0',
    },
    schemes: ['http', 'https'],
    enable: true,
    routerMap: true,
  };
  config.jwt = {
    enable: true,
    secret: 'hoolinks-legion-server',
    // @ts-ignore
    match: /^\/user|system/,
  };
  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};
