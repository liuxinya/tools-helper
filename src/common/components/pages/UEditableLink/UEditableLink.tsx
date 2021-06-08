import React from 'react';
import {Popover, Button, Input, Radio} from 'antd';
import {FileTextOutlined, LinkOutlined} from '@ant-design/icons';
import {UEditableLinkObj} from '../../../interfaces/page';

const LINK_TEXT = '按钮文案';

const defaultStyle: React.CSSProperties = {
    color: '#108cee',
    cursor: 'pointer',
    textDecoration: 'underline',
    display: 'inline-block',
};

const contentStyle: React.CSSProperties = {
    width: 200,
};

export function UEditableLink(props: {
    onChange?: (value: UEditableLinkObj) => void;
    value?: UEditableLinkObj;
    type?: 'button' | 'link';
    btnStyle?: React.CSSProperties;
}) {
    const {value: data, onChange, type = 'button', btnStyle = {}} = props;

    const handleInputChange: (key: 'text' | 'href', value: string) => void = (k, v) => {
        data[k] = v;
        onChange && onChange(data);
    };

    const handleDisabledChange: (value: boolean) => void = v => {
        data.disabled = v;
        onChange && onChange(data);
    };

    const content = (
        <div style={contentStyle}>
            <Radio.Group
                onChange={e => {handleDisabledChange(e.target.value);}}
                style={{marginBottom: 14}}
            >
                <Radio value={false}>启用链接</Radio>
                <Radio value>隐藏链接</Radio>
            </Radio.Group>
            <Input
                defaultValue={data.text || ''}
                onChange={e => {handleInputChange('text', e.target.value);}}
                prefix={<FileTextOutlined />}
            />
            <Input
                style={{marginTop: 10}}
                defaultValue={data.href || ''}
                onChange={e => {handleInputChange('href', e.target.value);}}
                prefix={<LinkOutlined />}
            />
        </div>
    );

    return (
        <Popover content={content} title="编辑链接" trigger="click">
            {
                type === 'button'
                    ? <Button style={btnStyle} type="primary">{data.text || LINK_TEXT}</Button>
                    : <div style={{...defaultStyle, ...btnStyle}}>{data.text || LINK_TEXT}</div>
            }
        </Popover>
    );
}
