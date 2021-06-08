import {useState, useEffect} from 'react';
import {Form} from 'antd';
import Modal from 'antd/lib/modal/Modal';
import {Ioc} from '@baidu/ioc';
import _ from 'lodash';
import {UFormGroup} from '../UFormGroup/UFormGroup';
import {UFormModalPropsObj, UFormModalEventsRxVal, UFormGroupDataObj} from '../../interfaces/page';
import {UDynamicService} from '../../services/dynamic';
import {isBoolean} from '../../helper/type';
import {useOnMount} from '../../myHooks/lifeCycle';
import {RxObject} from '../../helper/rx';

export function UFormModal(props: UFormModalPropsObj) {
    const [allProps, setAllProps] = useState(props);
    const [controllable] = useState<boolean>(() => isBoolean(allProps.modalProps.isShow));
    const [isShow, setIsShow] = useState<boolean>(() => {
        return controllable ? allProps.modalProps.isShow : true;
    });
    const [rx] = useState(() => new RxObject<UFormModalEventsRxVal>());
    const [form] = Form.useForm();
    const closeHandler = () => {
        setIsShow(false);
        if (!controllable) {
            (allProps.id) && Ioc(UDynamicService).destroyed(allProps.id);
        }
    };
    const cancelHandler = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        closeHandler();
        allProps.modalProps.onCancel && allProps.modalProps.onCancel(e);
    };
    const okHandler = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        // 校验
        form.validateFields().then(values => {
            allProps.modalProps.onOk && allProps.modalProps.onOk({
                e,
                close: closeHandler,
                form: form,
                values,
            });
        }).catch(errorInfo => {
            // eslint-disable-next-line no-console
            console.log(errorInfo);
        });
    };
    // 外界想自己打开
    useEffect(() => {
        controllable && setIsShow(allProps.modalProps.isShow);
    }, [allProps.modalProps.isShow, controllable]);

    // 更新allprops
    useEffect(() => {
        setAllProps(props);
    }, [props]);

    useOnMount(() => {
        allProps.onInited && allProps.onInited({
            form,
            rx,
        });
        rx.subscribe(e => {
            setAllProps(data => {
                e.forEach(item => {
                    try {
                        // 提供两种修改的方式
                        // 第一种： 通过路径 path 可修改任意某个节点的数据
                        // 第二种： 通过 target + targetPath
                        // 其中target值为name的值，只提供修改 form -> data 里面的数据 （推荐方式）
                        if (item.target && item.targetPath) {
                            const formData: UFormGroupDataObj[] = _.get(data, 'formProps.data');
                            const currIndex = formData.findIndex(curr => curr.name === item.target);
                            item.path = `formProps.data[${currIndex}].${item.targetPath}`;
                        }
                        data = _.set(data, item.path, item.val);
                    } catch (e) {
                        // eslint-disable-next-line no-console
                        console.log(e);
                    }
                });
                return {
                    // 这里一定要暴力克隆一份,我们需要更新深层次的数据，保证 UFormGroup 一定能更新
                    ..._.cloneDeep(data),
                };
            });
        });
        return () => {
            rx.unsubscribe();
        };
    });
    return (
        <Modal
            title="Base Modal"
            {...allProps.modalProps}
            onCancel={e => cancelHandler(e)}
            onOk={e => okHandler(e)}
            visible={isShow}
        >
            <UFormGroup form={form} {...allProps.formProps} />
        </Modal>
    );
}
