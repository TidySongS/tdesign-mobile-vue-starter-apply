# 快速开始

本项目是基于 Vue 3 + Vite + TypeScript 与 TDesign Mobile Vue 的移动端活动报名模板。

## 环境要求

- Node.js ≥ 18（推荐使用 20+）
- npm ≥ 9 或使用 yarn（本文以 npm 为例）

## 获取代码

```bash
# 方式一：Git 克隆
git clone https://github.com/TDesignOteam/tdesign-mobile-vue-starter-apply
cd tdesign-mobile-vue-starter-apply

# 方式二：直接下载压缩包并解压
```

## 安装依赖

```bash
npm install
```

## 启动开发服务器

```bash
npm run dev
```

> 启用 Mock 时会通过 MSW 在浏览器侧拦截 `/api/**` 请求，返回 `src/mocks` 中预置的数据。

启动后访问：`http://localhost:5173`

## 代理配置

为了接入腾讯地图接口，项目通过 Vite 代理该接口：

- 前缀：`/api/tencent-map`
- 目标：`https://apis.map.qq.com`

## 构建与预览

- 生产构建：

```bash
npm run build
```

- 本地预览：

```bash
npm run preview
```

## 文档站（VitePress）

- 启动文档开发：

```bash
npm run docs:dev
```

- 构建文档：

```bash
npm run docs:build
```

- 预览文档站：

```bash
npm run docs:preview
```
