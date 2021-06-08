#!/usr/bin/env bash
set -e

# 保证agile编译日志不出现乱码
export LC_ALL=en_US.UTF-8
export LANG=en_US.UTF-8
export LANGUAGE=en_US.UTF-8

# 准备npm, yarn
export PATH=$NODEJS_BIN_LATEST:$YARN_BIN_LATEST:$PATH

declare -r VERSION=$(git rev-parse --short=7 HEAD)

yarn install --registry=http://registry.npm.baidu-int.com
# AGILE_MODULE_NAME 对应icode代码库完整名称 baidu/xxx/yyy，保证唯一性
if [ -n "$CDN_TARGET" ]; then
    export CDN_PREFIX="$CDN_TARGET/$AGILE_MODULE_NAME/$VERSION/"
fi

rm -rf build
yarn run build || { echo 'build fail'; exit 1; }
echo $VERSION > build/version.txt
# 产出
rm -rf output && mkdir output
mv build/* output
# post-build
curl -fsSl http://gitlab.baidu.com/chenzhouji/shell-scripts/raw/master/post-build-v2.js > ./post-build.js
node ./post-build.js