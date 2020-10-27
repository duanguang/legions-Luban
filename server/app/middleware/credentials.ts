import { Context } from 'egg';

// 这里是你自定义的中间件
export default function credentials(): any {
  return async (ctx: Context, next: () => Promise<any>) => {
    ctx.set('Access-Control-Allow-Credentials', 'true');
    await next();
  };
}
