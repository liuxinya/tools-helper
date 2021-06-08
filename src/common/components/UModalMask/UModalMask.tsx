import {useEffect, useState} from 'react';
// import {useOnMount} from '../../myHooks/lifeCycle';
import './index.less';

const html = document.querySelector('html');
const body = document.body;

export function UModalMask(props: {
    children: JSX.Element;
    show: boolean;
    onTransitionEnd?: () => void;
    maskClosable?: boolean;
    onClickMask?: () => void;
    zIndex?: number;
}) {
    const [opacity, setOpacity] = useState<string>('0');

    useEffect(() => {
        if (props.show) {
            html.style.height = '100%';
            body.style.height = '100%';
            body.style.overflow = 'hidden';
            setTimeout(() => {
                setOpacity('1');
            }, 100);
        } else {
            html.style.height = 'auto';
            body.style.height = 'auto';
            body.style.overflow = 'auto';
            setOpacity('0');
        }
    }, [props.show]);

    const clickMaskHandler = () => {
        if (props.maskClosable) {
            props.onClickMask && props.onClickMask();
        }
    };

    return (
        <div
            onTransitionEnd={() => props.onTransitionEnd && props.onTransitionEnd()}
            className="u-modal-mask"
            style={{
                opacity,
                zIndex: props.zIndex || 999,
            }}
            onClick={clickMaskHandler}
        >
            <div className="container" style={{opacity}}>
                {
                    props.children
                }
            </div>
        </div>
    );
}
