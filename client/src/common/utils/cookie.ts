/**
 *设置cookie值
 *
 * @export
 * @param {*} name
 * @param {*} value
 * @param {*} iDay 有效期 数字
 */
export function setCookie(name:String,value:string|number,iDay:number){
    let oDate = new Date();
    oDate.setDate(oDate.getDate() + iDay);
    document.cookie = name + '=' + value + '; expires=' + oDate.toUTCString()
}
/**
 *获取cookie值
 *
 * @export
 * @param {*} name
 * @returns
 */
export function getCookie(name?:String):string{
    if(name){
        let arr = document.cookie.split('; ');
        for (let i = 0; i < arr.length; i++) {
            let arr2 = arr[i].split('=');
            if (arr2[0] == name) {
                return arr2[1];
            }
        }
    }

    return document.cookie||'';
}
/**
 *移除cookie
 *
 * @export
 * @param {*} name
 */
export function removeCookie(name:String):void{
    setCookie(name, 1, -1);
}
/**
 *清空
 *
 * @export
 */
export function clearAllCookie(){
    let keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if(keys) {
        for(var i = keys.length; i--;)
            document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
    }
}