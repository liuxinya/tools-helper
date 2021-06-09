
/**
 * 获取cookie
 * @param key 只获取某个key对应的value
 */

import {isObject} from './type';

export function getCookie(key?: string) {
    const cookie = getCookieToObj();
    return key ? cookie[key] : cookie;
}

export function setCookie<T>(key: string, value: T, ms: number = 0) {
    const valueStr: string = isObject(value) ? JSON.stringify(value) : String(value);
    let expires: string = '';
    if (ms > 0) {
        const d: Date = new Date();
        d.setTime(d.getTime() + ms);
        expires = '; expires=' + d.toUTCString();
    }
    document.cookie = key + '=' + escape(valueStr) + expires;
}

export function delCookie(key: string) {
    document.cookie = key + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
}

function getCookieToObj() {
    const cookie: string = document.cookie;
    const cookieArr: string[] = cookie.split(';');
    const res: cookieObj = {};
    cookieArr.forEach((item: string) => {
        const temArr = item.split('=');
        res[temArr[0].trim()] = unescape(temArr[1]);
    });
    return res;
}

interface cookieObj {
    [props: string]: string;
}
