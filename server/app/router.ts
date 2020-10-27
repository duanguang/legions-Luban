import { Application } from 'egg';
/* import * as bodyparser from 'koa-bodyparser'; */
export default (app: Application) => {
  const { controller, router, jwt } = app;

  router.get('/', controller.home.index);

  // @ts-ignore
  app.io
    .of('/socket/directive')
    // @ts-ignore
    .route('send', app.io.controller.directive.index);
};
