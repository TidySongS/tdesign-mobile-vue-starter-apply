# 进入开发

## 项目结构

正如您初始化项目后可以看到，`TDesign Mobile Vue Starter Apply` 的目录结构大致如下：

```bash
.
├── .github/              # GitHub 工作流配置
├── .husky/               # Git 钩子管理
├── .vscode/              # VS Code 项目配置
├── docs/                 # 项目文档
├── mocks                 # 模拟数据与接口
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

在项目的根目录，有 `.env.development` 配置文件，也可以根据实际需求继续扩展。项目会根据启动的命令中的 `mode` 参数，加载指定的配置文件的配置来运行， 如本地环境执行 `npm run dev`，因为对于命令中的 `mode` 参数为 `development`，项目运行会加载 `.env.development` 的配置来运行。

## 内置的环境变量

- `VITE_API_BASE_URL`: API 基础路径
- `VITE_APP_ENABLE_MOCKS`: 启用模拟数据
