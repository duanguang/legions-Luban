import { EggAppConfig, PowerPartial } from 'egg';
export default () => {
  const config: PowerPartial<EggAppConfig> = {};
  config.mongoose = {
    options: {},
  };
  config.jenkinsHost = 'http://token@192.168.200.58:7788';
  return config;
};
