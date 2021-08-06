# function.ts

+ 新增可组合方法执行的工具，后执行的方法是可拿到前面方法的返回的

+ 像管道一样可拔销

+ 数据流更清晰

    - compose 同步

    - composePromise 异步

* 使用示例

```ts
function a (i) {
    return i > 2 ? i + 1 : i;
}

function b(i) {
    return i * 2
}
const pip = compose(a, b);

pip(0); // 2
```