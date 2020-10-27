export {
  transformProperty,
  getExecutableScript,
  prettyPrint,
} from './codemodCore';

import { tablecodemod } from 'legions-gluttonous-ast';

export const transformTableComponentCode =
  tablecodemod.transformTableComponentCode;
/** 废弃函数,请勿调用 */
export const transformTableParames = tablecodemod.transformTableParames;
/** 转换接口令牌 */
export const transformTableToekn = tablecodemod.transformTableToekn;
