# 请求与数据

## 发起请求

`TDesign Mobile Vue Starter Apply` 初始化的项目中，采用 `axios` 做为请求的资源库，并进行了二次封装。封装后的 `axios` 实例位于 `src/utils/request`，你可以直接从 `@/utils/request` 路径导入使用。我们建议您在 `src/api` 目录中管理您的项目使用到的 `api`，并在具体组件/页面中使用。 大部分情况下，您不需要改动 `src/utils/request` 中的代码，只需要在 `src/api` 目录中新增您使用的接口，并在页面中引入接口使用即可。
