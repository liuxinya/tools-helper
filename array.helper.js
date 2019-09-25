import Vue from 'vue';
/**
 * 通过indexs 批量删除数组中的元素
 * @param {*} arr      []
 * @param {*} indexes  []
 */
export function removeFromArrayByIndexes(
    arr,
    indexes,
    setVal = (arr, index, value) => {
        arr[index] = value
    }
) {
    let map = new Map();
    let len = arr.length;
    let removeLen = 0;
    indexes.forEach((v, i) => {
        if (v < len) {
            map.set(v, v);
            removeLen = removeLen + 1;
        }
    })
    let count = 0;
    arr.forEach((item, i) => {
        if (map.has(i)) {
            count++;
        } else {
            setVal(arr, i - count, item);
            // if(i - removeLen + count >= arr.length - 1) {
            //     break;
            // }
        }
    })
    for (let i = 0; i < removeLen; i++) {
        arr.pop();
    }
    return arr;
}
/**
 * 通过index单个删除数组元素
 * @param {*} arr    []
 * @param {*} index  number
 */
export function removeFromArrayByIndex(arr, index) {
    return removeFromArrayByIndexes(arr, [index]);
}
export function exchangePositionByIndex(arr, index1, index2) {
    if (index1 < arr.length && index2 < arr.length && index1 >= 0 && index2 >= 0) {
        let temp = arr[index1];
        arr.$set(index1, arr[index2])
        arr.$set(index2, temp)
    }
    return arr;
}

// 向Arr里面添加新项
export function addToArrayByIndex(arr, index, value, setValue = (arr, index, val) => {
    arr[index] = val;
}) {
    let len = arr.length;
    index = index < 0 ? 0 : (index >= len ? len : index);
    for (let i = len; i > index; i--) {
        setValue(arr, i, arr[i - 1]);
    }
    setValue(arr, index, value);
    return arr;
}

export function removeFromArrayByCondition(arr, condition = (arr, index, val) => {
    arr[index] = val;
}, setValue = (arr, index, val) => {
    arr[index] = val;
}) {
    // 设置默认的condition
    condition = (!condition || typeof condition !== 'function') ? () => false : condition;
    let count = 0;
    // 移除指定条件的数组，这里应当需要遍历所有
    for (let i = 0; i < arr.length; i++) {
        if (condition(arr[i], i)) {
            // 需要移除，计个数
            count++;
        } else {
            // 不需要移除，那么需要前移
            if (count > 0) {
                setValue(arr, i - count, arr[i]);
            }
        }
    }
    for (let i = 0; i < count; i++) {
        arr.pop();
    }
    return arr;
}