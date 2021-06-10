import {useMemo, useReducer} from 'react';
import {RxObject} from '@baidu/bce-helper';
import {useOnMount} from './lifeCycle';

const rx = new RxObject();
function reducer<T, K>(
    actions: K
) {
    return (state: T, action: ReduxStoreAction<K, T>): T => {
        let res = null;
        Object.keys(actions).forEach(item => {
            if (action.type === item) {
                res = {
                    ...state,
                    ...(actions as any)[item](action.data),
                };
                rx.next(res);
            }
        });
        return res || state;
    };
}

export function useMyReducer<K, T>(actions: K, initStateValue: T): [
    T,
    React.Dispatch<ReduxStoreAction<K, T>>,
    MyReducerEvent<T>
] {
    const reducerMemo = useMemo(() => {
        return reducer<T, K>(actions);
    }, [actions]);
    const [state, dispatch] = useReducer(reducerMemo, initStateValue);

    useOnMount(() => {
        if (initStateValue) {
            rx.next(initStateValue);
        }
    });

    return [
        state,
        dispatch,
        {
            getValue: () => rx.getValue() as T,
        },
    ];
}

export interface MyReducerEvent<T> {
    getValue: () => T;
}

// redux action
export interface ReduxStoreAction<T, K = null> {
    type: keyof T;
    data?: K;
    [props: string]: any;
}
