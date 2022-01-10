import { runApp, IAppConfig, config } from 'ice';

const appConfig: IAppConfig = {
  router: {
    type: 'browser',
  },
  request: {
    baseURL: config.baseURL,
  },
};

runApp(appConfig);
