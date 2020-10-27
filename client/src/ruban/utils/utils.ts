
/**
 * win path 验证
 *
 * @export
 * @param {string} contwinpath
 * @returns
 */
export function windowsPathValidation(contwinpath: string) {
    if ((contwinpath.charAt(0) !== '\\' || contwinpath.charAt(1) !== '\\') || (contwinpath.charAt(0) !== '/' || contwinpath.charAt(1) !== '/')) {
        if (!contwinpath.charAt(0).match(/^[a-zA-Z]/)) {
            return false;
        }
        if (!contwinpath.charAt(1).match(/^[:]/) || !contwinpath.charAt(2).match(/^[\/\\]/)) {
            return false;
        }
    }
}


/**
 * linux path 验证
 *
 * @export
 * @param {string} contPathLinux
 * @returns
 */
export function linuxPathValidation(contPathLinux:string)
{
    for(let k=0;k<contPathLinux.length;k++){
     if(contPathLinux.charAt(k).match(/^[\\]$/)){
      return false;
     }
    }
    if(contPathLinux.charAt(0) !== '/')
    {
     return false;
    }
    if(contPathLinux.charAt(0) === '/' && contPathLinux.charAt(1) === '/')
    {
     return false;
    }
    return true;
}

export function getOperationSys():'Windows'|'Mac'|'iphone'|'ipod'|'ipad'|'Android' {
    let OS = null;
    let OSArray = {};
    let UserAgent = navigator.userAgent.toLowerCase();
    OSArray['Windows'] = (navigator.platform === 'Win32') || (navigator.platform === 'Windows');
    OSArray['Mac'] = (navigator.platform === 'Mac68K') || (navigator.platform === 'MacPPC')
      || (navigator.platform === 'Macintosh') || (navigator.platform === 'MacIntel');
    OSArray['iphone'] = UserAgent.indexOf('iPhone') > -1;
    OSArray['ipod'] = UserAgent.indexOf('iPod') > -1;
    OSArray['ipad'] = UserAgent.indexOf('iPad') > -1;
    OSArray['Android'] = UserAgent.indexOf('Android') > -1;
    for (let i in OSArray) {
      if (OSArray[i]) {
        OS = i;
      }
    }
    return OS;
}

/**
 * 取出css module中指定样式名称的值
 * @param styleFile 样式文件
 * @param styleName 样式名称
 */
export function computeStyle(styleFile: object | object[], styleName: string | Array<string>) {
    let styleTxt = '';
    let tempStyleFile = {};
    function compute(name: string) {
        if (tempStyleFile[name]) {
            return tempStyleFile[name];
        } else {
            return '';
        }
    }

    if (Array.isArray(styleFile)) {
        styleFile.forEach(style => {
            tempStyleFile = { ...tempStyleFile, ...style };
        });
    } else {
        tempStyleFile = styleFile;
    }

    if (Array.isArray(styleName)) {
        styleTxt = styleName
            .map(name => {
                return compute(name);
            })
            .join(' ');
    } else {
        styleTxt = compute(styleName);
    }
    return styleTxt;
}

/** 获取url参数 */
export function getUrlParam(search:string, name:string) {
    const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    const r = search.substr(1).match(reg);
    if (r !== null) return unescape(r[2]);
    return null;
}
