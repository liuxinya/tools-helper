import {message, Upload} from 'antd';
import {useEffect, useState} from 'react';
import {UploadChangeParam, UploadFile} from 'antd/lib/upload/interface';
import {isProd} from '../../helper/env';
import {UUploadProps, UploadResponseObj} from '../../interfaces/page';
import {ResponseObj} from '../../interfaces/common';

import './style.less';

const uploadUrl: string = isProd()
    ? 'http://bjyz-bce-p3m-fe00.bjyz.baidu.com:8100/api/upload'
    : 'https://yapi.baidu-int.com/mock/11060/api/cms_developer/upload';

export function UUploader(props: UUploadProps) {
    const {onChange, onRemove, maxLength = 1, className, fileList = null, children} = props;
    const [fileListState, setFileList] = useState<UploadFile[]>([]);

    const uploadButton = children ? children : (
        <div>
            +<br />Upload
        </div>
    );

    useEffect(() => {
        if (!fileList) {
            return;
        }
        const newFileList: UploadFile[] = fileList.filter(item => {
            return !!item.url;
        }).map((file, index) => {
            return {
                name: file.url,
                thumbUrl: file.url,
                type: 'image/png',
                uid: file.url + String(index),
                size: 300,
                ...file,
            } as any;
        });
        setFileList(newFileList);
    }, [fileList]);


    const onChangeHandler: (info: UploadChangeParam<UploadFile<ResponseObj<UploadResponseObj>>>) => void = info => {
        const {file, fileList} = info;
        if (file.status === 'error') {
            message.error('上传失败');
        }
        else if (file.status === 'done') {
            const response = file.response;
            if (response.success) {
                const newFileList = fileList.map(fileItem => {
                    if (fileItem.response && fileItem.response.result && fileItem.response.result.fileUrl) {
                        fileItem.url = fileItem.response.result.fileUrl;
                        file.url = fileItem.response.result.fileUrl;
                    }
                    return fileItem;
                }).slice(0 - maxLength);
                setFileList(newFileList);
                onChange && onChange({
                    e: info,
                    file,
                    fileList: newFileList,
                });
            } else {
                message.error('上传失败');
            }
        }
        else if (file.status === 'removed') {
            onChange && onChange({
                e: info,
                file: {
                    ...file,
                    url: '',
                },
                fileList,
            });
        }
    };

    const onRemoveHandler: (file: UploadFile<ResponseObj<UploadResponseObj>>) => void = f => {
        const newFileList: UploadFile[] = fileListState.filter(file => {
            return f.uid !== file.uid;
        });
        setFileList(newFileList);
        onRemove && onRemove(f);
    };

    return (
        <Upload
            action={uploadUrl}
            listType="picture-card"
            accept="image/*"
            {
                ...props
            }
            fileList={fileListState}
            className={`${(className || 'ui-upload-default')}`}
            onChange={onChangeHandler}
            onRemove={onRemoveHandler}
            name="name"
        >
            {
                fileListState.length >= maxLength ? null : uploadButton
            }
        </Upload>
    );
}

