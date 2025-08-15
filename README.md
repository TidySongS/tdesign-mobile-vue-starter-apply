# TDesign 移动端活动报名页面模板

tdesign-mobile-vue-starter-apply 是一个基于 TDesign Mobile Vue 移动端组件库，使用 Vue3、Vite、TypeScript 开发，拥有"首页"、"我的" 两大模块，包含热门推荐、活动列表、个人信息、购买确认、购买结果等多个功能模块，是一个针对活动报名场景的纯前端页面模版。

## 项目功能

### 已完成页面
1. **购买确认页面** (`/buy-confirm`)
   - 活动信息展示（标题、时间、地点）
   - 人员信息选择（支持多人员选择）
   - 票类场次选择
   - 票档价格选择（支持早鸟价和正价）
   - 实时价格计算
   - 确认购买功能

2. **人员信息页面** (`/person-info`)
   - 个人信息表单（姓名、生日、手机号、身份证、邮箱、职业）
   - 日期选择器（生日选择）
   - 职业选择器
   - 设为默认开关
   - 表单验证和保存

3. **购买结果页面** (`/buy-result`)
   - 购买成功状态展示
   - 订单信息详情
   - 操作按钮（查看订单、返回首页）

### 技术特性
- 基于 TDesign Mobile Vue 组件库
- 响应式设计，适配移动端
- TypeScript 类型支持
- Vue 3 Composition API
- 现代化构建工具链

## 快速开始

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 类型检查
```bash
npm run type-check
```

## 项目结构

```
src/
├── pages/                    # 页面组件
│   ├── buy-confirm/         # 购买确认页面
│   ├── person-info/         # 人员信息页面
│   ├── buy-result/          # 购买结果页面
│   └── ...
├── router/                  # 路由配置
├── store/                   # 状态管理
└── main.ts                  # 应用入口
```

## 组件使用

### TDesign Mobile Vue 组件
项目已配置 TDesign Mobile Vue 组件的自动导入，可直接使用以下组件：

- `t-navbar` - 导航栏
- `t-button` - 按钮
- `t-cell` - 单元格
- `t-input` - 输入框
- `t-switch` - 开关
- `t-date-picker` - 日期选择器
- `t-picker` - 选择器
- `t-icon` - 图标
- `t-divider` - 分割线

### 页面跳转
```typescript
import { useRouter } from 'vue-router'

const router = useRouter()

// 跳转到购买确认页面
router.push('/buy-confirm')

// 跳转到人员信息页面
router.push('/person-info')

// 返回上一页
router.back()
```

## 设计规范

### 颜色规范
- 主色调：`#0052d9` (蓝色)
- 成功色：`#00a870` (绿色)
- 背景色：`#f5f5f5` (浅灰)
- 文字色：`#333` (深灰)

### 间距规范
- 页面内边距：`16px`
- 组件间距：`12px` - `16px`
- 卡片圆角：`8px`

### 字体规范
- 标题：`18px` - `20px`
- 正文：`14px` - `16px`
- 辅助文字：`12px` - `14px`

## 开发指南

### 添加新页面
1. 在 `src/pages/` 目录下创建新的页面组件
2. 使用 `t-navbar` 组件作为页面头部
3. 遵循现有的样式规范

### 表单处理
1. 使用 `reactive` 管理表单数据
2. 使用 `computed` 计算派生状态
3. 添加适当的表单验证

### 样式编写
1. 使用 Less 预处理器
2. 遵循 BEM 命名规范
3. 使用 CSS 变量管理主题色

## 浏览器支持

- iOS Safari 12+
- Android Chrome 70+
- 微信内置浏览器

## 许可证

MIT License
