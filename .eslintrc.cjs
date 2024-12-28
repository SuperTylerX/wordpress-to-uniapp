// eslint-disable-next-line @typescript-eslint/no-require-imports
const { defineConfig } = require('eslint-define-config')

const isProduction = process.env.NODE_ENV === 'production'

module.exports = defineConfig({
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  globals: {
    getApp: true,
    __wxConfig: true,
    uni: true,
    App: true,
    Page: true
  },
  plugins: ['vue', '@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-typescript/recommended',
    '@vue/eslint-config-prettier'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    tsconfigRootDir: __dirname,
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  rules: {
    // == 下面规则是基于 eslint-plugin-import 插件的 ==
    // import 后面必须有空行
    'import/newline-after-import': 'error',
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true
        }
      }
    ],
    // ==
    'prettier/prettier': 'warn',
    'vue/multi-word-component-names': 'off',
    'no-console': isProduction
      ? [
          'error',
          {
            allow: ['warn', 'error']
          }
        ]
      : 'off',
    '@typescript-eslint/no-unused-vars': [
      isProduction ? 'error' : 'warn',
      {
        // const { foo, ...reset } = obj;
        // 使用了 reset, foo 没有使用不会报错
        ignoreRestSiblings: true,
        // function foo(a, b) {};
        // 使用了 b, a 没有使用不会报错
        args: 'after-used',
        // try catch 里面的 error 可以不使用
        caughtErrors: 'none'
      }
    ],
    // ts type必须使用type类型导入
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        disallowTypeAnnotations: false
      }
    ]
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true
      }
    }
  }
})
