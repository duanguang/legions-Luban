export function compose() {
    let args = arguments;
    let start = args.length - 1;
    return function() {
        let i = start;
        // @ts-ignore
        let result = args[start].apply(this,arguments);
        // @ts-ignore
        while (i--) result = args[i].call(this, result);
        return result;
    };
}
