/* eslint-disable @typescript-eslint/ban-types */
/**
 * 项目公共接口，页面、渲染组件、业务组件。。相关
 */

import {ModalProps} from 'antd/lib/modal/Modal';
import {Rule, FormProps, FormInstance, FormItemProps} from 'antd/lib/form';
import {InputProps, TextAreaProps} from 'antd/lib/input';
import {SelectProps} from 'antd/lib/select';
import {ButtonProps} from 'antd/lib/button';
import {RangePickerProps} from 'antd/lib/date-picker/generatePicker';
import {DatePickerProps} from 'antd/lib/date-picker';
import {Moment} from 'moment';
import {RowProps} from 'antd/lib/row';
import {ColProps} from 'antd/lib/col';
import {NamePath} from 'antd/lib/form/interface';
import {ValidateErrorEntity} from 'rc-field-form/es/interface';
import {UploadProps} from 'antd/lib/upload';
import {UploadChangeParam, UploadFile} from 'antd/lib/upload/interface';
import {RadioGroupProps} from 'antd/lib/radio';
import {PopconfirmProps} from 'antd/lib/popconfirm';
import {TableProps} from 'antd/lib/table';
import {ForwardedRef} from 'react';
import {RxObject} from '../helper/rx';
import {ResponseObj, PageRequestObj, PageResponseObj} from './common';

// 下拉数据
export interface USelectDataObj {
    title: string;
    value: string | number;
    disabled?: boolean;
    [props: string]: any;
}

// form表单data
interface SelProps extends SelectProps<string | number> {
    data: USelectDataObj[];
}
export interface UFormGroupDataObj<Values = any> {
    type: 'Input' | 'Button' | 'Select' | 'DatePicker' | 'RangePicker' | 'TextArea' | 'Uploader' | 'RadioGroup';
    label?: string;
    name?: keyof Values | NamePath;
    rules?: Rule[];
    colProps?: ColProps;
    show?: boolean;
    FormItemProps?: FormItemProps<Values>;
    InputProps?: InputProps;
    SelectProps?: SelProps;
    ButtonProps?: ButtonProps;
    DatePickerProps?: DatePickerProps;
    RangePickerProps?: RangePickerProps<Moment>;
    TextAreaProps?: TextAreaProps;
    UploaderProps?: UUploadProps;
    RadioGroupProps?: RadioGroupProps;
}

export interface UFormPropsObj<Values = any> extends FormProps {
    data: Array<UFormGroupDataObj<Values>>;
    rowProps?: RowProps;
    colProps?: ColProps;
}

export type UFormModalEventsRxVal = Array<{
    path?: string;
    target?: string;
    targetPath?: string;
    attr?: string;
    val: any;
}>;

export type UFormModalEvents<T = any> = {
    form: FormInstance<T>;
    rx: RxObject<UFormModalEventsRxVal>;
};
export interface UFormModalPropsObj<Values = any> {
    onInited?: (e: UFormModalEvents) => any;
    modalProps: Omit<ModalProps, 'onOk'> & {
        isShow?: boolean;
        onOk?: (p: {
            e: React.MouseEvent<HTMLElement>;
            close: () => void;
            form: FormInstance<any>;
            values?: Values;
            errorInfo?: ValidateErrorEntity<Values>;
        }) => void;
    };
    formProps?: UFormPropsObj<Values>;
    id?: Element;
}

// 图片上传返回的数据
export interface UploadResponseObj {
    fileId: string;
    fileName: string;
    fileSize: number;
    fileType: 'png' | 'jpg' | 'jpeg' | 'gif';
    fileUrl: string;
    smallFileUrl: string;
}

export interface UUploadChangeParam {
    e: UploadChangeParam<UploadFile<ResponseObj<UploadResponseObj>>>;
    file: UploadFile;
    fileList: UploadFile[];
}

export interface UUploadProps extends Omit<UploadProps, 'onChange' | 'fileList' | 'defaultFileList'> {
    onChange?: (e: UUploadChangeParam) => void;
    maxLength?: number;
    fileList?: Array<{
        url: string;
        name?: string;
    }>;
    children?: JSX.Element;
}
export interface UButtonProps extends ButtonProps {
    popConfirmProps?: PopconfirmProps;
    action?: string;
    hide?: boolean;
}

export interface UEditableLinkObj {
    disabled?: boolean;
    text: string;
    href: string;
}


type ListParams<T> = T & Partial<PageRequestObj>;
export type UTableApi<ListItem, Params> = {
    getListData: () => PageResponseObj<ListItem>;
    getListHttp: (
        params?: ListParams<Params>
    ) => Promise<PageResponseObj<ListItem>>;
};
export interface UTableProps<Record = any, Params = any> extends TableProps<Record> {
    onSort?: (info: Record[]) => void;
    query?: {
        url: string;
        params: ListParams<Params> | (() => ListParams<Params>);
    };
    ref?: ForwardedRef<UTableApi<Record, Params>>;
    sortable?: boolean; // 是否启用排序,默认启用，不启用设置为false
}
