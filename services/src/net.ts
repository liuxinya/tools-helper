import message from 'antd/lib/message';
import Axios, {AxiosRequestConfig, AxiosResponse} from 'axios';
import {Injectable} from '@baidu/ioc';
import {isString, replaceOfString} from '@baidu/bce-portal-helper';

@Injectable()
export class UNetService {
    static setHeader(key: string, value: string | boolean) {
        Axios.defaults.headers.common[key] = value;
    }
    static setTimeout(timeout: number) {
        Axios.defaults.timeout = timeout;
    }
    static setUrl(url: string) {
        Axios.defaults.baseURL = url;
    }
    static setInterceptors(interceptors: UInterceptor[]) {
        interceptors.forEach((interceptor: UInterceptor) => {
            Axios.interceptors.request.use(interceptor.request);
            Axios.interceptors.response.use(interceptor.response);
        });
    }
    get<T, K, Q = never>(url: string, params?: T, query?: Q, config: AxiosRequestConfig = {}): Promise<ResponseObj<K>> {
        config.params = params;
        url = this.urlHandler(url, query);
        return this.sendData<T, K>('get', url, config);
    }
    post<T, K, Q = never>(url: string, params?: T, query?: Q, config: AxiosRequestConfig = {}): Promise<ResponseObj<K>> {
        config.params = params;
        url = this.urlHandler(url, query);
        return this.sendData<T, K>('post', url, config.params);
    }
    delete<T, K, Q = never>(url: string, params?: T, query?: Q, config: AxiosRequestConfig = {}): Promise<ResponseObj<K>> {
        config.params = params;
        url = this.urlHandler(url, query);
        return this.sendData<T, K>('delete', url, config);
    }
    put<T, K, Q = never>(url: string, params?: T, query?: Q, config: AxiosRequestConfig = {}): Promise<ResponseObj<K>> {
        config.params = params;
        url = this.urlHandler(url, query);
        return this.sendData<T, K>('put', url, config.params);
    }

    private urlHandler<Q>(url: string, query: Q) {
        if (query) {
            const assemblyUrlQuery: any = {};
            Object.keys(query).forEach((item: string) => {
                assemblyUrlQuery[`:${item}`] = (query as any)[item];
            });
            return replaceOfString(url, assemblyUrlQuery);
        } else {
            return url;
        }
    }

    private sendData<T, K>(methods: NetMethods, url: string, config: AxiosRequestConfig | T = {}): Promise<ResponseObj<K>> {
        return new Promise(async (resolve, reject) => {
            try {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                await Axios[methods](url, config).then((data: AxiosResponse<ResponseObj<K>>) => {
                    // 有可能返回的是个文件流
                    if (isString(data.data) || data.data.success) {
                        resolve(data.data);
                    } else {
                        reject(data.data);
                    }
                });
            } catch (e) {
                reject(e);
                message.error('* ' + JSON.stringify(e));
            }
        });
    }
}

export interface UInterceptor {
    response: (response: AxiosResponse) => Promise<AxiosResponse>;
    request: (config: AxiosRequestConfig) => Promise<AxiosRequestConfig>;
}


export type NetMethods = 'get' | 'post' | 'put' | 'delete';

// http响应
export interface ResponseObj<T, K = null> {
    success: boolean;
    status: number;
    code?: string;
    message?: ResponseMsgObj;
    error?: K; // 错误数据
    result?: T; // 正常数据
    page?: PageResponseObj<T>; // 分页数据
    errcode?: number;
    errmsg?: string;
}

// http message
export interface ResponseMsgObj {
    detail: any;
    code?: number;
    global: string;
}

// http分页响应
export interface PageResponseObj<T> {
    order: string;
    orderBy: string;
    pageNo: number;
    pageSize: number;
    totalCount: number;
    result: T[];
}