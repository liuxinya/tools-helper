// 用来缓存类方法的返回值，让复杂的不需要重复执行第二次的方法 直接拿到上次的返回结果

const dataMap: Map<any, any> = new Map();

export type CacheFunParams<T = any> = T & {cache?: boolean};

export function FunReturnCache(isCache = true) {
    return function FunReturnCache(target: any, key: string, descriptor: PropertyDescriptor) {
        const originFun = descriptor.value;
        descriptor.value = async function (args: CacheFunParams = {cache: isCache}) {
            const {cache, ...restArgs} = args;
            const val = dataMap.get(target);
            if (val?.[key] && cache) {
                return val[key];
            }
            const res = await originFun.call(this, restArgs);
            dataMap.set(target, {
                ...val,
                [key]: res,
            });
            return res;
        };
    };
}


