/**
 * 从URL里面拿到 ？后面的 key value 以对象形式返回
 */
export function getAllParamsFromUrl(type: 'hash' | 'search' = 'search', url: string = null): {[props: string]: any} {
    const paramsStr = (url || window.location[type]).split('?')[1];
    const res = {};
    if (paramsStr) {
        const paramsStrArr = paramsStr.split('&');
        paramsStrArr.forEach(item => {
            const paramsArr = item.split('=');
            const val = paramsArr[1] === 'true' ? true : paramsArr[1] === 'false' ? false : paramsArr[1];
            // @ts-ignore
            res[paramsArr[0]] = val;
        });
    }
    return res;
}

/**
 * 匹配url中是否存在某一段 传入一个正则或者字符串
 */
export function isContainInUrl(reg: RegExp | string): boolean {
    const url = window.location.href;
    if (typeof reg === 'string') {
        return url.indexOf(reg) > 0;
    }
    return reg.test(url);
}

/**
 * 根据query生成url
 * @param query  query对象
 * @param pathname 默认为location.pathname
 * @returns url字符串
 */
export function getUrlfromQuery(query: {[props: string]: string}, pathname: string = location.pathname): string {
    return Object.keys(query).reduce((res, key, idx) => `${res}${idx === 0 ? '?' : '&'}${key}=${query[key]}`, pathname);
}
