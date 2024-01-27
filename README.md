
# ⚡️ 简介

一个开箱即用，基于 `vite 5` + `vue 3` + `uvui` + `pinia` 的`uniapp`项目模板。

# 🚀 开发

1. 安装

```
pnpm install
```

2. 运行

```
pnpm run dev:mp-weixin
```

`运行成功后，使用微信开发者工具，选择mp-weixin目录并打开（路径：dist/dev/mp-weixin），即可预览。`


# 📦️ 多环境打包

```

- 生产环境打包

```
npm run build:mp-weixin
```

`打包完成后，使用微信开发者工具，选择mp-weixin目录并打开，目录路径：dist/build/mp-weixin，在微信开发者工具中点击上传即可。`


# 🔧 代码检查修复

```
npm run lint:fix
```

# 📚 目录

```
├─ .env.xxx // 各环境的配置文件
├─ .eslintrc.js // eslint配置
├─ vite.config.ts // 项目配置
├─ tsconfig.json // ts配置
├─ index.html // 入口文件
└─ src
  │─ App.vue // 根容器
  │─ main.ts
  │  
  ├─ components // 组件
  │          
  ├─ config // 项目级配置
  │    │
  │    └─index.ts
  │      
  ├─ pages // 页面
  │
  │          
  ├─ api // 接口
  │   │  
  │   │─ request.ts // 封装
  │   └─ api // 接口
  │      
  ├─ static // 静态资源
  │              
  ├─ store // pinia
  │      
  ├─ types // ts类型定义
  │      
  └─ utils // 工具库
  │ │  index.ts
  │ │  toast.ts // 弹窗封装
  └─
```
