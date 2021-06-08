/**
 * 部署沙盒和上线按钮
 * @file USaveBtns.tsx
 */

import {Ioc} from '@baidu/ioc';
import {message} from 'antd';
import {UButtonGroup} from '../../UButtonGroup/UButtonGroup';
import {UNetService} from '../../../services/net';
import {UButtonProps} from '../../../interfaces/page';

export function UPublishBtns(props: {
    // 发布前的回调 外界可通过返回 false 值的promsie来阻断发布
    beforePublish?: (isOnline: boolean) => Promise<boolean>;
    // 发布后的回调
    afterPubish?: (isOnline: boolean, res: boolean) => void;
    publishUrl: string;
    data: any;
}) {

    const onPublish = async (isOnline: boolean) => {
        let isNext: boolean = true;
        if (props.beforePublish) {
            isNext = await props.beforePublish(isOnline);
        }
        if (isNext) {
            const url = isOnline ? `${props.publishUrl}/publish` : props.publishUrl;
            const res = await Ioc(UNetService).post<{data: any}, boolean>(url, {
                data: JSON.stringify(props.data),
            });
            const msgType = res.result ? 'success' : 'error';
            const extrText = isOnline ? '线上' : '沙盒';
            const msg = res.result ? `发布${extrText}成功` : `发布${extrText}失败`;
            message[msgType](msg);
            props.afterPubish && props.afterPubish(isOnline, res.result);
        }
    };

    const btnData: UButtonProps[] = [
        {
            title: '上线',
            type: 'primary',
            style: {
                float: 'right',
                margin: '10px 10px 0 0',
            },
            popConfirmProps: {
                title: '请确保已在沙盒预览，且效果符合预期后再上线',
                placement: 'topRight',
                onConfirm: () => onPublish(true),
            },
        },
        {
            title: '部署沙盒',
            type: 'primary',
            style: {
                float: 'right',
                margin: '10px 10px 0 0',
            },
            onClick: () => onPublish(false),
        },
    ];

    return (
        <div className="u-button-group">
            <UButtonGroup style={{overflow: 'hidden'}} data={btnData} />
        </div>
    );
}
