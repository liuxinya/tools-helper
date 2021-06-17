export function replaceOfString(str: string, varObj: any, rule = 'i') {
    let res: string = str;
    Object.keys(varObj).forEach(item => {
        res = res.replace(new RegExp(item, rule), varObj[item]);
    });
    return res;
}

/**
 * 获取字符长度
 * @param str 需要获取长度的字符串
 * @returns number 字符长度
 */
 export function getByteLen(str: string): number { // 传入一个字符串
    let len = 0;
    for (let i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 255) {
            len += 2;
        } else {
            len += 1;
        }
    }
    return len;
}

// 中文
export function checkChinese(str: string) {
    return Boolean(str.match(/[\u4e00-\u9fa5]/g));
}

// 全角
export function checkFullWidth(str: string) {
    return Boolean(str.match(/[\uff00-\uffff]/g));
}

// 半角
export function checkHalfWidth(str: string) {
    // eslint-disable-next-line no-control-regex
    return Boolean(str.match(/[\u0000-\u00ff]/g));
}
