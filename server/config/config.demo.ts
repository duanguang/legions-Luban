import { EggAppConfig, PowerPartial } from 'egg';
export default () => {
  const config: PowerPartial<EggAppConfig> = {};
  config.mongoose = {
    options: {},
  };
  return config;
};
