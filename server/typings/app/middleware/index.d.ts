// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportCredentials from '../../../app/middleware/credentials';
import ExportGzip from '../../../app/middleware/gzip';
import ExportProxy from '../../../app/middleware/proxy';

declare module 'egg' {
  interface IMiddleware {
    credentials: typeof ExportCredentials;
    gzip: typeof ExportGzip;
    proxy: typeof ExportProxy;
  }
}
