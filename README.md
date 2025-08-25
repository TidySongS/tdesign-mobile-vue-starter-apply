<p align="center"><img src="https://tdesign.gtimg.com/site/TDesign.png" alt="tdesign logo" width="30%"/></p>

# TDesign 移动端活动报名页面模板

tdesign-mobile-vue-starter-apply 是一个针对活动报名场景的纯前端页面模板，它基于 TDesign Mobile Vue 移动端组件库，并采用 Vue 3、Vite 和 TypeScript 等现代前端技术栈进行开发。

该模板包含“首页”和“我的”两大核心模块，涵盖了热门推荐、活动列表、个人信息、购买确认、购买结果等多个功能页面，旨在为开发者提供一个快速启动、功能完整的移动端页面开发起点。

## ✨ 核心功能

- **首页**:
  - **热门推荐**: 轮播图展示精选活动
  - **活动列表**: 支持按 "最新" 和 "高分" 排序，并提供多维度筛选功能（面向领域、活动形式、日期和价格范围）
  - **滚动加载**: 活动列表支持按需加载，提供流畅的浏览体验

- **我的**:
  - **个人中心**: 展示用户头像、昵称和职业信息
  - **活动管理**: 根据状态（待参加、已完成、全部）分类管理已报名的活动

- **活动详情**:
  - **基本信息**: 展示活动的时间、地点、门票价格和详情介绍
  - **用户评价**: 呈现用户对活动的评分和评论
  - **会场嘉宾**: 展示活动嘉宾和会场信息
  - **报名入口**: 提供收藏、分享和立即购买的入口

- **购买与报名**:
  - **订单确认**: 填写和确认报名人信息、选择票种和场次
  - **个人信息填写**: 页面支持填写姓名、手机号、身份证、邮箱和职业等信息，并支持选择日期和城市

- **结果与分享**:
  - **购买结果**: 成功购买后展示电子票信息和报名人信息
  - **分享功能**: 展示将活动信息分享给好友或社交媒体的入口界面

## 🎨 视觉稿

本项目基于 TDesign 提供的移动端活动报名页面视觉稿。

- **视觉稿地址**: `https://codesign.qq.com/app/s/578083411595522`
- **访问密码**: `YFS5`

## 📦 技术栈

本项目采用以下技术与工具链，确保高效、规范的开发体验。

### UI 框架

- **tdesign-mobile-vue**: TDesign 适配移动端的组件库，专为 Vue 3 项目设计

### 构建与开发工具

- **Vue 3**: 渐进式 JavaScript 框架
- **Vite**: 极速构建工具
- **TypeScript**: 强类型语言，增强代码健壮性
- **Less**: 样式预处理器

### 插件

- **unplugin-vue-components**: 自动加载组件，无需手动导入
- **unplugin-auto-import**: 直接使用 Vue 的 Composition API 等，无需手动导入
- **unplugin-vue-router**: 基于文件系统的自动路由，简化路由配置

### 代码风格

- **ESLint**: 使用 `antfu/eslint-config` 规则集，遵循单引号、无分号等现代 JavaScript 风格
- **Composition API**: 采用 `<script setup>` 语法糖，提供更简洁的 Composition API 语法

### 开发工具

- **Volar**: 强大的 Vue 3 IDE 支持，特别优化了对 `<script setup>` 的支持
- **ESLint**: 代码风格和质量检查工具

## 📂 项目结构

```bash
src/
├── api                 # 接口请求封装
├── components          # 通用组件
├── constants           # 常量定义
├── hooks               # 自定义 Hooks
├── mocks               # 模拟数据和 API 请求
├── pages               # 业务页面
├── router              # 路由配置
├── store               # 状态管理
├── style               # 全局样式
├── types               # TypeScript 类型定义
├── App.vue             # 根组件
└── main.ts             # 项目入口文件
```

## 🚀 快速启动

1. 克隆项目

```bash
git clone https://github.com/TidySongS/tdesign-mobile-vue-starter-apply
cd tdesign-mobile-vue-starter-apply
```

2. 安装依赖

```bash
npm install
```

3. 运行项目

本项目支持两种开发模式：

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

## 🔨 构建与部署

- 构建生产环境代码:

```bash
npm run build
```

- 预览生产构建结果:

```bash
npm run preview
```

> 此命令会在本地启动一个静态服务器，预览 dist 目录下的生产代码。

## 🔎 规范与检查

- 类型检查:

```bash
npm run type-check
```

- 代码风格检查:

```bash
npm run lint
```

- 自动修复代码风格问题:

```
npm run lint:fix
```
