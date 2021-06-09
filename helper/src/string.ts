export function replaceOfString(str: string, varObj: any, rule = 'i') {
    let res: string = str;
    Object.keys(varObj).forEach(item => {
        res = res.replace(new RegExp(item, rule), varObj[item]);
    });
    return res;
}
