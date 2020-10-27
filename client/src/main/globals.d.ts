import { IWindow } from '../common/typings/global';
/*import ComponentClass = __React.ComponentClass;*/



/* interface Window {
    CONFIG: any,
    
} */

declare global {    
    namespace NodeJS {        
        interface Global {
            CONFIG: any,
        }
    }
    interface Window {
        ReactStore: IWindow;
    }
}

