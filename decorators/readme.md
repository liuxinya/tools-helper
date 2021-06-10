### FunReturnCache

* 缓存函数复杂的计算，下次函数再次执行，直接拿到返回值

* 支持异步

* 可以用来缓存计算、减少http执行次数

```ts

export class Test {

  @FunReturnCache()
  testFun() {
    return 1 + 1 + 1
  }

}

```


### state

* 这个是用来标记类属性的

* 被装饰的属性 被实例原型deps数组所收集
