import { Context } from 'egg';
module.exports = () => {
    return async (ctx: Context, next: () => Promise<any>) => {
      console.error(ctx.request.method);
      /* ctx.socket.emit('message', 'packet received!'); */
      await next();
    };
}