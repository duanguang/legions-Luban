import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
  const config: PowerPartial<EggAppConfig> = {};
  config.mongoose = {
    // url: 'mongodb://admin:admin@192.168.1.184:27017/bggood-application?authSource=admin',
    /* url: 'mongodb://frontEndDb:hoolinks-123@192.168.200.25:27017/frontEndDb', */
    url: 'mongodb://127.0.0.1:27017/frontEndDb',
    options: {},
  };
  config.jenkinsHost = 'http://token@192.168.100.176:8080';
  return config;
};
