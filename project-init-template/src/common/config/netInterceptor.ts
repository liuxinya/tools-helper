import {AxiosResponse, AxiosRequestConfig} from 'axios';
import {Injectable} from '@baidu/ioc';
import {message, notification} from 'antd';
import {isObject, isNill} from '../helper/type';
import {ResponseObj} from '../interfaces/common';


@Injectable()
export class UNetInterceptor implements UInterceptor {
    async response(config: AxiosResponse<ResponseObj<any>>) {
        if (config.status === 302) {
            message.warn('请登录，即将跳到登录页...');
            setTimeout(() => {
                window.location.href = `${window.location.origin}/logout`;
            }, 1000);
        }
        if (!config.data.success && config.data?.message?.global) {
            const msg = config.data.message.global || config.data.message.detail || '哎呦，出错了';
            notification.error({
                message: config.data.message?.code,
                description: msg,
                duration: 8,
            });
        }
        return config;
    }
    async request(config: AxiosRequestConfig) {
        const params = config.data || config.params;
        if (isObject(params)) {
            Object.keys(params).forEach(item => {
                if (isNill(params[item])) {
                    delete params[item];
                }
            });
        }
        return config;
    }
}

export interface UInterceptor {
    response: (response: AxiosResponse) => Promise<AxiosResponse>;
    request: (config: AxiosRequestConfig) => Promise<AxiosRequestConfig>;
}
