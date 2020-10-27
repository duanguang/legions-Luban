export const commonRegex = {
    REQUIRED: /[^(^\s*)|(\s*$)]/,
    CHINESE: /^[\u0391-\uFFE5]+$/,
    NUMBER: /^[\d]+$/,//或者/^\d+$/
    INTEGER: /^[-\+]?\d$/,//正负整数
    PLUSINTEGER: /^[+]?\d$/,
    DOUBLE: /^[-\+]?\d+(\.\d+)?$/,
    PLUSDOUBLE: /[+]?\d+(\.\d+)?$/,
    ENGLISH: /^[A-Z a-z]+$/,
    USERNAME: /^[a-z]\w{3,}$/i,
    MOBILE: /^1[3|4|5|7|8][0-9]\d{8}$/,
    PHONE: /^\d{3}-\d{8}|\d{4}-\d{7,8}$/,//手机号
    EMAIL: /^[\w\.]+([-]\w+)*@\w+[\.]\w*$/,
    URL: /^http|https:\/\/\w+\.\w+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/,
    PATH: /^\/(.*)\/?$/i,
    IP: /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/,
    QQ: /^[1-9]\d{4,10}$/,
    DECIMAL: /^\d+(\.\d+)*$/,
    ZIPCODE: /^[1-9]\d{5}$/,
    /** 集装箱号 */
    PACKBOXNO: /^[A-Z]{4}[0-9]{7}$/,
    /** 价格，整数位10位，小数位4位 */
    PRICE: /^\d{1,10}(\.\d{0,4})?$/,
    /** 单位转化率，整数位10位，小数位6位 */
    RATE: /^\d{1,10}(\.\d{0,6})?$/,
    /** 重量，整数位9位，小数位9位 */
    WEIGHT: /^\d{1,9}(\.\d{0,9})?$/,
}

export function RegExChk(type:validatorType, value:string){
    // let $pintu=value.replace(/(^\s*)|(\s*$)/g, "");
    let $pintu=value;
    let regex;
    switch(type){
        case validatorType.required:
            regex = commonRegex.REQUIRED;
            return regex.test($pintu);
        case validatorType.chinese:
            regex = commonRegex.CHINESE;
            return regex.test($pintu);
        case validatorType.number:
            regex = commonRegex.NUMBER;
            return regex.test(regex);
        case validatorType.integer:
            regex = commonRegex.INTEGER;
            return regex.test($pintu);
        case validatorType.plusInteger:
            regex = commonRegex.PLUSINTEGER;
            return regex.test($pintu);
        case validatorType.double:
            regex = commonRegex.DOUBLE;
            return regex.test($pintu);
        case validatorType.plusDouble:
            regex = commonRegex.PLUSDOUBLE;
            return regex.test($pintu);
        case validatorType.english:
            regex = commonRegex.ENGLISH;
            return regex.test($pintu);
        case validatorType.username:
            regex = commonRegex.USERNAME;
            return regex.test($pintu);
        case validatorType.mobile:
            regex = commonRegex.MOBILE;
            return regex.test($pintu);
        case validatorType.phone:
            regex = commonRegex.PHONE;
            return regex.test($pintu);
        case validatorType.email:
            regex = commonRegex.EMAIL;
            return regex.test($pintu);
        case validatorType.url:
            regex = commonRegex.URL;
            return regex.test($pintu);
        case validatorType.path:
            regex = commonRegex.PATH;
            return regex.test($pintu);
        case validatorType.ip:
            regex = commonRegex.IP;
            return regex.test($pintu);
        case validatorType.qq:
            regex = commonRegex.QQ;
            return regex.test($pintu);
        case validatorType.decimal:
            regex = commonRegex.DECIMAL;
            return regex.test($pintu);
        case validatorType.zipCode:
            regex = commonRegex.ZIPCODE;
            return regex.test($pintu);
        default:
            return false;
    }
}

export enum validatorType{
    required=0,
    chinese=1,
    number=2,
    integer=3,
    plusInteger=4,
    double=5,
    plusDouble=6,
    english=7,
    username=8,
    mobile=9,
    phone=10,
    email=11,
    url=12,
    ip=13,
    qq=14,
    decimal=15,
    zipCode=16,
    path = 17
}
/*export function  getRegexRule(rules:IRule[]){
    if(rules)  {
        return rules.map((rule:IRule)=> {
            if(rule.regex||rule.validatorType) {
                return {validator: regexValidator(rule)}
            }

        })
    }
    return [];
}*/
