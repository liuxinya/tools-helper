import {useState, useCallback, useRef} from 'react';
import {Ioc} from '@baidu/ioc';
import {UNetService, PageResponseObj} from '@baidu/bce-services';
import {isFunction} from '@baidu/bce-helper';
import {useStateRef} from './useStateRef';
import {useOnMount} from './lifeCycle';

// 基于body的无限滚动
export function useInfiniteList<T, P = any>(props: {
    distanceBottom: number;
    pageSize?: number;
    httpUrl?: string | (() => string);
    httpParams?: P;
    defaultTrigger?: boolean; // 是否默认就触发一次请求
    arriveBottomAction?: () => void;
}): [
    T[],
    boolean,
    (isResetData?: boolean) => Promise<void>,
    boolean,
    PageResponseObj<T>
] {
    const {pageSize = 10} = props;
    const pageNo = useRef<number>(0);
    const [list, setList] = useState<T[]>([]);
    const [currlistData, setCurrListData] = useState<PageResponseObj<T>>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [isLoadingMore, setLoadingMore, isLoadingMoreRef] = useStateRef<boolean>(true);
    const getList = useCallback(async (isResetData: boolean = true) => {
        setLoading(true);
        if (isResetData) {
            pageNo.current = 0;
            setLoadingMore(true);
        }
        if (!isLoadingMoreRef.current) {
            setLoading(false);
            return;
        }
        isResetData && (pageNo.current = 0);
        const res = await Ioc(UNetService).get<any, T>(
            isFunction(props.httpUrl) ? (props.httpUrl as any)() : props.httpUrl,
            {
                pageNo: ++pageNo.current,
                pageSize: pageSize || 10,
                ...props.httpParams,
            }
        );
        const len = res.page.result.length;
        setCurrListData(res.page);
        if (len >= 0) {
            setList(data => {
                return isResetData ? [...res.page.result] : data.concat(res.page.result);
            });
        }
        if (len < pageSize) {
            setLoadingMore(false);
        }
        setLoading(false);
    }, [isLoadingMoreRef, pageSize, props.httpParams, props.httpUrl, setLoadingMore]);

    useOnMount(() => {
        if (props.defaultTrigger) {
            getList();
        }
    });

    useOnMount(() => {
        const body = document.body;
        // 当前可见区域
        const clientHeight = document.documentElement.clientHeight;
        // 距离底部距离
        const distanceBottom = props.distanceBottom;
        let currY = 0;
        let flag = true;
        const scrollHanlder = () => {
            // body总高
            const bodyHeight = body.offsetHeight;
            // eslint-disable-next-line @typescript-eslint/naming-convention
            const pageYOffset = window.pageYOffset;
            const isArriveBottom = bodyHeight - pageYOffset - clientHeight <= distanceBottom;
            if (!isArriveBottom) {
                flag = true;
            }
            if (
                // 到底底部
                isArriveBottom
                // 正向滚动
                && pageYOffset - currY > 0
                // 只触发一次
                && flag
            ) {
                flag = false;
                if (props.httpUrl) {
                    getList(false);
                }
                props.arriveBottomAction && props.arriveBottomAction();
            }
            currY = pageYOffset;
        };
        window.addEventListener('scroll', scrollHanlder);
        return () => {
            window.removeEventListener('scroll', scrollHanlder);
        };
    });
    return [
        list,
        isLoadingMore,
        getList,
        loading,
        currlistData,
    ];
}