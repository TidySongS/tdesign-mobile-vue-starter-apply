# 进入开发

## 项目结构

正如您初始化项目后可以看到，`TDesign Mobile Vue Starter Apply` 的目录结构大致如下：

```bash
.
├── .github/              # GitHub 工作流配置
├── .husky/               # Git 钩子管理
├── .vscode/              # VS Code 项目配置
├── docs/                 # 项目文档
├── mocks/                # 模拟数据与接口
├── public/               # 静态资源
├── src/                  # 页面代码
├── types/                # TypeScript 类型定义
├── .cnb.yml              # 云原生构建配置文件
├── .env.development      # 开发环境变量
├── .gitignore            # Git 忽略文件
├── eslint.config.mjs     # ESLint 配置
├── index.html            # 主 html 文件
├── package-lock.json     # 依赖包版本锁文件
├── package.json          # 依赖包版本及启动配置
├── README.md             # 项目说明
├── tsconfig.app.json     # TypeScript 应用配置
├── tsconfig.json         # TypeScript 主配置
├── tsconfig.node.json    # TypeScript Node.js 配置
└── vite.config.ts        # Vite 配置文件
```

## 页面代码结构

如上所示，`src` 目录下是页面代码，大部分情况下，您只需要增删 `src` 目录下的代码即可。

`src` 内的结构大致如下所示，我们推荐您在使用的过程中，遵守既有的目录结构，以规范项目代码的组织结构。

```bash
src/
├── api                 # 请求层
├── assets              # 资源层
├── components          # 通用组件
├── config              # 配置层
├── constant            # 常量层
├── hooks               # 自钩子层
├── pages               # 业务模块层
├── router              # 路由层
├── store               # 数据层
├── styles              # 样式目录
├── utils               # 工具层
├── App.vue             # 根组件
└── main.ts             # 项目入口文件
```

## 环境变量

项目根目录提供 `.env.development` 配置文件，你也可以按需扩展更多环境文件。

启动时项目会根据命令参数中的 `mode` 加载对应的环境配置。例如本地执行 `npm run dev`（`mode` 为 `development`），将读取 `.env.development`。

> .env 文件管理的环境变量在项目打包时被注入到代码中。

### 内置环境变量

以下是项目中已预定义的环境变量：

- `VITE_API_BASE_URL`: API 基础路径
- `VITE_APP_ENABLE_MOCKS`: 是否启用 MSW Mock

```ini [.env.development]
VITE_API_BASE_URL=/api
VITE_APP_ENABLE_MOCKS=true
```

## 全局配置

项目通过 `public/config.json` 文件来管理全局配置，如应用名称、版本号和 `API` 密钥。

`src/config/index.ts` 中的 `loadAppConfig` 函数负责在应用启动时加载此文件，并将其配置对象注入到 `window.appConfig` 和 `Vue` 实例的 `$config` 属性中，方便在组件中访问。

::: tip 说明
这样做的好处是：你可以将项目打包一次，然后部署到不同的环境中。在部署时，只需替换 `public` 目录下的` config.json` 文件，就能轻松切换不同的配置，例如不同的 `API` 密钥或应用名称，而无需重新运行 `npm run build` 命令。
:::

### 配置说明

```json [public/config.json]
{
  "app": {
    "name": "Tdesign Mobile Vue Starter Apply",
    "version": "0.0.0"
  },
  "apiKey": {
    "tencentMap": "your_tencent_map_api_key_here"
  }
}
```
