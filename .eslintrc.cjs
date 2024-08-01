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
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/eslint-config-typescript/recommended',
    '@vue/eslint-config-prettier'
  ],
  plugins: ['vue', '@typescript-eslint'],
  rules: {
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
    ]
  }
})
