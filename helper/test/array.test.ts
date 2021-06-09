import {addToArrayByIndex, removeFromArrayByCondition, changePositionByIndex} from '../src/array';

// 向Arr里面添加新项
test('addToArrayByIndex [1, 3] => [1 ,2 ,3]', () => {
    const arr = [1, 3];
    expect(addToArrayByIndex(arr, 1, 2)).toEqual([1, 2, 3]);
});

// 通过某个条件移出某些项
test('removeFromArrayByCondition remove 1 from [1,3]  => [3]', () => {
    const arr = [1, 3];
    expect(
        removeFromArrayByCondition(arr, (item: number) => item === 1)
    ).toEqual([3]);
});


// 通过索引交换位置
test('changePositionByIndex [1, 3] => [3,1]', () => {
    const arr = [1, 3];
    expect(changePositionByIndex(arr, 0, 1)).toEqual([3, 1]);
});
