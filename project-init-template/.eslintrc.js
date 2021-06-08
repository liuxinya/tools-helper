/* eslint-disable import/no-commonjs,import/unambiguous */
module.exports = {
    extends: [
        '@ecomfe/eslint-config/strict',
        '@ecomfe/eslint-config/import/strict',
        '@ecomfe/eslint-config/typescript/strict',
        '@ecomfe/eslint-config/react/strict',
        '@baidu/eslint-config-legion',
    ],
    env: {
        jest: true,
    },
    rules: {
        // 不能用type 去定义一个类型
        '@typescript-eslint/consistent-type-definitions': 'off',
        // eslint不能完美检测 d.ts 类型从而导致不能引入， 去掉
        'import/no-extraneous-dependencies': 'off',
        'max-len': [
            'error',
            {
                code: 150,
            },
        ],
        // promise限制关闭
        '@typescript-eslint/no-floating-promises': 'off',
        // jsx 类的事件需要绑定this 但是其他属性不需要 没必要一刀切
        'react/jsx-no-bind': 'off',
        // 关闭参数不能重新赋值
        'no-param-reassign': 'off',
        // ts 特有的type interface可以像方法一样先引入后书写
        'no-use-before-define': 'off',
        // 关掉装饰器和反射的限制
        'new-cap': 'off',
        // ts 类的书写限制 不能用属性修饰符
        'no-useless-constructor': 'off',
        // ts 类的书写限制 不能用属性修饰符
        '@typescript-eslint/prefer-readonly': 'off',
        // ts 类的书写限制 不能用属性修饰符
        '@typescript-eslint/member-ordering': 'off',
        // 方法可先使用后定义，这样可以让一些方法的定义在主逻辑之后
        '@typescript-eslint/no-use-before-define': [
            'error',
            {'functions': false},
        ],
        'no-console': 'warn',
    },
    settings: {
        react: {
            version: 'detect',
        },
        'import/resolver': {
            typescript: {},
            node: {
                extensions: ['js', 'ts', 'tsx'],
            },
        },
    },
};
