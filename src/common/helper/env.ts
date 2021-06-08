import {HOST_DOMAIN_MAP} from '../constant/variableConst';

const isProdVar = process.env.NODE_ENV === 'production';

// 非开发环境
export function isProd() {
    return isProdVar;
}

// 沙盒环境
export function isSandBox() {
    return !HOST_DOMAIN_MAP.CMS_ONLINE.includes(window.location.host) && isProd();
}

// 线上
export function isOnline() {
    return HOST_DOMAIN_MAP.CMS_ONLINE.includes(window.location.host) && isProd();
}
