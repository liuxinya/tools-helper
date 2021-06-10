import {useState} from 'react';
import {Ioc} from '@baidu/ioc';
import {UNetService, NetMethods} from '@baidu/bce-portal-services';
import {isUndefined, isFunction} from '@baidu/bce-portal-helper';
import {useOnMount} from './lifeCycle';


/**
 *
 * @param url 请求URL
 * @param reqParams 请求参数
 * @param isImmediately 是否立即触发一次请求
 */

 type httpConfig<Req, Res, ResOrigin, Q> = {
    methods: NetMethods;
    url: string;
    params?: Req;
    query?: Q;
    // 数据转换
    transform?: (p: ResOrigin) => Res;
    succCallBack?: (p: Res) => void;
    errorCallBack?: (p: any) => void;
    isExecSuccessCallBack?: boolean;
    defaultValue?: Partial<Res>;
};

export function useHttp<Req, Res, ResOrigin = Res, Q = any>(
    httpConfig: httpConfig<Req, Res, ResOrigin, Q>,
    isImmediately?: boolean | (() => boolean)
): [
    Res,
    React.Dispatch<React.SetStateAction<Res>>,
    (params?: Req, config?: Partial<httpConfig<Req, Res, ResOrigin, Q>>) => Promise<Res>,
    boolean
] {
    const [data, setData] = useState<Res>((httpConfig.defaultValue as Res) || null);
    const [loading, setLoading] = useState<boolean>(false);
    const http = (
        params = httpConfig.params,
        config: Partial<httpConfig<Req, Res, ResOrigin, Q>> = httpConfig
    ): Promise<Res> => {
        // 外界可二次更改所有参数
        const newConfig = {
            isExecSuccessCallBack: true,
            ...httpConfig,
            ...config,
        };
        return new Promise((resolve, reject) => {
            setLoading(true);
            Ioc(UNetService)[newConfig.methods]<Req, Res, Q>(newConfig.url, params, newConfig.query).then(res => {
                // 考虑分页数据
                const resOrigin = isUndefined(res.result) ? (res.page || res) : res.result;
                const resRes = newConfig.transform ? newConfig.transform((resOrigin as any)) : resOrigin;
                setData(resRes as Res);
                newConfig.succCallBack && newConfig.isExecSuccessCallBack && newConfig.succCallBack(resRes as Res);
                setLoading(false);
                resolve(resRes as Res);
            }).catch(err => {
                newConfig.errorCallBack && newConfig.errorCallBack(err);
                setLoading(false);
                reject(err);
            });
        });
    };
    useOnMount(() => {
        const isImmediatelyTem = isFunction(isImmediately) ? (isImmediately as any)() : isImmediately;
        if (isImmediatelyTem) {
            http(httpConfig.params);
        }
    });
    return [
        data,
        setData,
        http,
        loading,
    ];
}
