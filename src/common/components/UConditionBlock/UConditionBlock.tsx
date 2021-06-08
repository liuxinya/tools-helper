/**
 * @file 显示或隐藏模块
 */

import {Fragment} from 'react';

export function UConditionBlock(props: {
    condition: boolean;
    if?: JSX.Element;
    else?: JSX.Element;
    children?: JSX.Element | JSX.Element[];
}) {
    const {condition, if: ifEle = null, else: elseEle = null, children} = props;
    if (condition) {
        return <Fragment>{children || ifEle}</Fragment>;
    } else {
        return <Fragment>{elseEle}</Fragment>;
    }
}
