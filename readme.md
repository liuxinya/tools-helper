## 更新指南

1. 安装所有 package 的依赖

```ts
lerna bootstrap
```

2. 更新包内容之后 可执行一次 `lerna changed` 查看待发布包

3. 没问题执行  `lerna run build`  `lerna publish`




## `其他`

+ `lerna clean`  

    - 清理所有 package 的 node_modules 文件夹

* `lerna run build`

    - 执行所有 package 的 `build` 指令