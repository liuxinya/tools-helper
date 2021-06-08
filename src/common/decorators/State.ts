
/* eslint-disable no-proto */
/* eslint-disable no-unused-expressions */
import {isArray} from '../helper/type';

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
