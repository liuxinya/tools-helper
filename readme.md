## 更新指南

1. 安装依赖

```ts
lerna bootstrap
```

2. 更新包内容之后 可执行一次 `lerna changed` 查看待发布包

3. 没问题执行  `lerna run build`  `lerna publish`