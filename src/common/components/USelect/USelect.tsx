import {useEffect, useState} from 'react';
import {Select} from 'antd';
import {SelectProps} from 'antd/lib/select';
import {USelectDataObj} from '../../interfaces/page';

const {Option} = Select;

interface USelectProps<VT> extends SelectProps<VT> {
    data: USelectDataObj[];
    style?: React.CSSProperties;
    // 自定义key 让外界可以通过自定义的属性 决定回显 默认value
    key?: string;
}

export function USelect(props: USelectProps<string| number>) {
    const [data, setData] = useState<USelectDataObj[]>(props.data);

    // 有可能外界，异步的去改变了 data
    useEffect(() => {
        if (props.data && props.data.length > 0) {
            setData([...props.data]);
        }
    }, [props.data]);
    return (
        <div className="u-select" style={{width: '100%'}}>
            <Select style={{width: '100%', ...props.style}} {...props}>
                {
                    data.map(item => {
                        return (
                            <Option
                                disabled={item.disabled || false}
                                key={props.key ? item[props.key] : item.value}
                                value={props.key ? item[props.key] : item.value}
                            >
                                {item.title}
                            </Option>
                        );
                    })
                }
            </Select>
        </div>
    );
}
