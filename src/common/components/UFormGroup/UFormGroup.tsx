/**
 * 最初设想， 传递一个json就能渲染出form表单
 */
import {useState, useEffect, useMemo} from 'react';
import {Form, Input, Button, Row, Col, DatePicker, Radio} from 'antd';
import {NamePath} from 'antd/lib/form/interface';
import _ from 'lodash';
import {UFormGroupDataObj, UFormPropsObj} from '../../interfaces/page';
import {UUploader} from '../UUploader/UUploader';
import {USelect} from '../USelect/USelect';
import {isBoolean} from '../../helper/type';

const {RangePicker} = DatePicker;

const {TextArea} = Input;


const renderFormByType = (item: UFormGroupDataObj) => {
    switch (item.type) {
        case 'Input':
            return (
                <Input {...item.InputProps} />
            );
        case 'Select':
            return (
                <USelect {...item.SelectProps} />
            );
        case 'Button':
            return (
                <Button {...item.ButtonProps}>
                    {item.ButtonProps.title}
                </Button>
            );
        case 'RangePicker':
            return (
                <RangePicker {...item.RangePickerProps} />
            );
        case 'DatePicker':
            return (
                <DatePicker {...item.DatePickerProps} />
            );
        case 'TextArea':
            return (
                <TextArea {...item.TextAreaProps} />
            );
        case 'Uploader':
            return (
                <UUploader {...item.UploaderProps} />
            );
        case 'RadioGroup':
            return (
                <Radio.Group {...item.RadioGroupProps} />
            );
        default:
            return null;
    }
};

export function UFormGroup(propsTem: UFormPropsObj) {

    const [props, setProps] = useState<UFormPropsObj>(() => {
        return {
            labelCol: {span: 8},
            wrapperCol: {span: 16},
            // 默认一行摆一个
            colProps: {
                span: 24,
            },
            ...propsTem,
        };
    });

    const renderChildForm = useMemo(() => {
        // 考虑外界可以快速摆放表单，这里增加了栅格
        return (
            <Row {...props.rowProps}>
                {
                    props.data.map((item, index) => {
                        return (
                            <Col
                                // eslint-disable-next-line react/no-array-index-key
                                key={index}
                                style={isBoolean(item.show) && {display: item.show ? 'block' : 'none'}}
                                {...(item.colProps || props.colProps)}
                            >
                                <Form.Item
                                    label={item.label}
                                    name={item.name as NamePath}
                                    rules={item.rules}
                                    {...item.FormItemProps}
                                >
                                    {renderFormByType(item)}
                                </Form.Item>
                            </Col>
                        );
                    })
                }
            </Row>
        );
    }, [props.colProps, props.data, props.rowProps]);

    // 异步更改数据 重新赋值
    useEffect(() => {
        setProps(data => {
            return {
                ...data,
                ...propsTem,
            };
        });
    }, [propsTem]);

    return (
        <div className="u-form">
            <Form
                {..._.omit(props, 'colProps', 'rowProps')}
                name="basic"
            >
                {renderChildForm}
            </Form>
        </div>
    );
}
