import { Context } from 'egg';

// 这里是你自定义的中间件
export default function connection(): any {
  return async (ctx: Context, next: () => Promise<any>) => {
     ctx.socket.emit('res', 'connected!');
     await next();
  };
}
