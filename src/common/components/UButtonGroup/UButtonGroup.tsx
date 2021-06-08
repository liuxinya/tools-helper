import {Button, Popconfirm} from 'antd';
import React from 'react';
import {UButtonProps} from '../../interfaces/page';


export function UButtonGroup(props: {
    data: UButtonProps[];
    style?: React.CSSProperties;
    marginRight?: string;
    onClick?: (action?: string) => void;
}) {
    const clickHander = (action: string) => {
        props.onClick && props.onClick(action);
    };
    return (
        <div style={{...props.style}} className="u-button-group">
            {
                props.data.map((item, index) => {
                    const {popConfirmProps, hide, ...rest} = item;
                    if (popConfirmProps) {
                        return (
                            <Popconfirm
                                // eslint-disable-next-line react/no-array-index-key
                                key={index}
                                onConfirm={() => clickHander(item.action)}
                                {...popConfirmProps}
                            >
                                <Button
                                    onClick={() => {
                                        if (popConfirmProps) {
                                            return;
                                        }
                                        clickHander(item.action);
                                    }}
                                    style={{
                                        marginRight: 10,
                                        ...item.style,
                                        display: hide ? 'none' : 'inline-block',
                                    }}
                                    {...rest}
                                >
                                    {item.title}
                                </Button>
                            </Popconfirm>
                        );
                    } else {
                        // eslint-disable-next-line react/no-array-index-key
                        return (
                            <Button
                                onClick={() => clickHander(item.action)}
                                style={{marginRight: 10, ...item.style}}
                                key={Math.random().toString(36).substr(3)}
                                {...item}
                            >
                                {item.title}
                            </Button>
                        );
                    }
                })
            }
        </div>
    );
}
