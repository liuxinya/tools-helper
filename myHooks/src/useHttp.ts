import {useState} from 'react';
import {Ioc} from '@baidu/ioc';
import {UNetService, NetMethods} from '@baidu/bce-portal-services';
import {useOnMount} from './lifeCycle';


/**
 *
 * @param url 请求URL
 * @param reqParams 请求参数
 * @param isImmediately 是否立即触发一次请求
 */

type httpConfig<Req, Res, ResOrigin> = {
    methods: NetMethods;
    url: string;
    params?: Req;
    // 数据转换
    transform?: (p: ResOrigin) => Res;
    succCallBack?: (p: Res) => void;
    errorCallBack?: (p: any) => void;
    isExecSuccessCallBack?: boolean;
    defaultValue?: Partial<Res>;
};


const net = Ioc(UNetService);

export function useHttp<Req, Res, ResOrigin = Res>(
    httpConfig: httpConfig<Req, Res, ResOrigin>,
    isImmediately?: boolean
): [
    Res,
    React.Dispatch<React.SetStateAction<Res>>,
    (params: Req, config?: Partial<httpConfig<Req, Res, ResOrigin>>) => Promise<Res>,
    boolean
] {
    const [data, setData] = useState<Res>((httpConfig.defaultValue as Res) || null);
    const [loading, setLoading] = useState<boolean>(false);
    const http = (
        params = httpConfig.params,
        config: Partial<httpConfig<Req, Res, ResOrigin>> = httpConfig
    ): Promise<Res> => {
        // 外界可二次更改所有参数
        const newConfig = {
            isExecSuccessCallBack: true,
            ...httpConfig,
            ...config,
        };
        return new Promise((resolve, reject) => {
            setLoading(true);
            net[newConfig.methods]<Req, Res>(newConfig.url, params).then(res => {
                // 考虑分页数据
                const resOrigin = res.result || res.page;
                const resRes = (newConfig.transform?.(resOrigin as any) ?? resOrigin) as Res;
                setData(resRes);
                newConfig.isExecSuccessCallBack && newConfig.succCallBack?.(resRes);
                setLoading(false);
                resolve(resRes);
            }).catch(err => {
                newConfig.errorCallBack?.(err);
                setLoading(false);
                reject(err);
            });
        });
    };
    useOnMount(() => {
        if (isImmediately) {
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
