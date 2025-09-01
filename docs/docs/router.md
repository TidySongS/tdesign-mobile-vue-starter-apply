# 路由配置

## 路由与菜单

路由与菜单的管理是前端项目中非常重要的一部分。为了减少开发配置和理解成本，项目采用了 `unplugin-vue-router` 插件，实现基于文件系统的自动路由生成。

## 如何工作

传统的路由管理需要手动在数组中配置路由路径、组件和元数据。而该项目通过 `unplugin-vue-router` 插件，可以根据你创建的文件和文件夹自动生成路由。你无需手动在路由文件中配置每个页面的路径，只需在 `src/pages` 目录下创建 `.vue` 文件，插件就会自动为你生成对应的路由。

### 路由对应目录结构

```bash
src/pages/
├── index.vue             # 首页 (/)
├── main.vue              # 主布局页面
├── main/
│   ├── index.vue         # 主页 (/main)
│   └── user.vue          # 用户中心 (/main/user)
├── activity-detail/
│   └── [id].vue          # 活动详情页 (/activity-detail/:id)
├── buy-confirm/
│   └── [id].vue          # 购买确认页 (/buy-confirm/:id)
├── buy-result/
│   └── [id].vue          # 购买结果页 (/buy-result/:id)
├── person-info/
│   └── index.vue         # 个人信息页 (/person-info)
├── select-location/
│   └── index.vue         # 选择城市页 (/select-location)
└── [...all].vue          # 匹配所有未被其他路由规则命中的 URL
```

### 动态路由

动态路由可以根据文件名中包含的 `[]` 来自动生成，例如 `[id]` 将生成 `:id` 动态参数。
