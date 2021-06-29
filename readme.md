## 更新指南

1. 安装所有 package 的依赖

```ts
lerna bootstrap
```

2. 更新包内容之后 可执行一次 `lerna changed` 查看待发布包

3. 编译 `lerna run build`  

4. 发布 `lerna publish` 只发布不提交至git仓库 `lerna publish --no-push`


## `其他`

+ `lerna clean`  

    - 清理所有 package 的 node_modules 文件夹

* `lerna run build`

    - 执行所有 package 的 `build` 指令

* `发布失败了，包版本已经被lerna更改了咋办`

回退方案
```
lerna publish from-git

git reset --hard HEAD~1 && git tag -d $(git log --date-order --tags --simplify-by-decoration --pretty=format:'%d' | head -1 | tr -d '()' | sed 's/,* tag://g')

```