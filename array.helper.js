import Vue from 'vue';
/**
 * 通过indexs 批量删除数组中的元素
 * @param {*} arr      []
 * @param {*} indexes  []
 */
export function removeFromArrayByIndexes(
    arr,
    indexes,
) {
    let map = new Map();
    let len = arr.length;
    let removeLen = 0;
    indexes.forEach((v, i) => {
        if(v < len) {
            map.set(v, v);
            removeLen = removeLen + 1;
        }
    })
    let count = 0;
    arr.forEach((item, i) => {
        if(map.has(i)) {
            count++ ;
        }else {
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
    return removeFromArrayByIndexes(arr, [index], setVal);
}
export function exchangePositionByIndex(arr, index1, index2) {
    if(index1 < arr.length && index2 < arr.length && index1 >=0 && index2 >=0) {
        let temp = arr[index1];
        arr.$set(index1, arr[index2])
        arr.$set(index2, temp)
    }
    return arr;
}
function setVal(arr, index, value) {
    arr[index] = value
}