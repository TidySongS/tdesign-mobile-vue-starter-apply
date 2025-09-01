# 快速开始

## 启动项目

在启动项目前，请确保您已经拥有`node`与`npm`的开发环境。
项目并没有限制使用何种包管理器，您也可以采用`yarn`或`pnpm`做您的包管理器，以下使用`npm`做演示.

**安装依赖**

```bash
npm install
```

**运行项目**

- 开发模式 (无 Mock):

```bash
npm run dev
```

> 该命令会启动一个无 Mock 的开发服务器，适用于后端已就绪的场景。

- 开发模式 (带 Mock):

```bash
npm run dev:mock
```

> 该命令会启动一个集成 MSW 的开发服务器，你可以直接访问 http://localhost:5173 查看页面效果，所有 API 请求都会被 mocks 文件夹下的服务拦截和模拟。
