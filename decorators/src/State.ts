// 这个是用来标记类属性的
// 被装饰的属性 被实例原型deps数组所收集

import {isArray} from '@baidu/bce-portal-helper';


export function State(isResetWhenDestroy = true) {
    return (target: any, propertyKey: string) => {
        if (!isArray(target.__proto__.deps)) {
            target.__proto__.deps = [];
        }
        target.__proto__.deps.push({
            key: propertyKey,
            isReset: isResetWhenDestroy,
        });
    };
}
