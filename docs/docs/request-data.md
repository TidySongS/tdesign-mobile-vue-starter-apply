# 请求与数据

### 发起请求

`TDesign Mobile Vue Starter Apply` 初始化的项目中，采用 `axios` 做为请求的资源库，并进行了二次封装。封装后的 `axios` 实例位于 `src/utils/request`，你可以直接从 `@/utils/request` 路径导入使用。我们建议您在 `src/api` 目录中管理您的项目使用到的 `api`，并在具体组件/页面中使用。 大部分情况下，您不需要改动 `src/utils/request` 中的代码，只需要在 `src/api` 目录中新增您使用的接口，并在页面中引入接口使用即可。

通过引入封装好的 axios 实例发起请求：

- 示例🌰

```typescript
import axios from '@/utils/request'

export function getOccupations() {
  return axios.get('/occupations')
}
```

然后在实例组件导入定义的api即可：

```js
// 在vue文件中导入api发送请求
// ...
import { getOccupations } from '@/api/info'

// 在异步函数中调用
async function fetchData() {
  try {
    const list = await getOccupations()
    console.log(list)
  }
  catch (error) {
    console.error('请求失败:', error)
  }
}
```

项目中的请求封装还提供了以下特性：

- 统一的 baseURL 配置（默认为 `/api`）
- 3秒超时设置
- 响应拦截器自动提取 `response.data`
- 统一错误处理和提示机制
- 支持请求取消

### Mock 数据

项目使用 [MSW (Mock Service Worker)](https://mswjs.io/) 作为 Mock 解决方案，在开发环境中拦截请求并返回模拟数据。

#### 启用方式

Mock 功能通过环境变量控制，默认在开发环境中启用：

```bash
# .env.development
VITE_APP_ENABLE_MOCKS=true
```

#### Mock 配置

- **Mock 入口**: `src/mocks/browser.ts`
- **路由处理器**: `src/mocks/handlers.ts`
- **虚拟数据库**: `src/mocks/db.ts`

#### 使用示例

在 `src/mocks/handlers.ts` 中定义 Mock 路由：

```typescript
export const handlers = [
  http.get('/api/occupations', async () => {
    await delay(500)
    const all = db.occupation.getAll()
    return HttpResponse.json({
      data: all,
    })
  }),
]
```

#### 数据生成

项目使用 `@mswjs/data` 和 `@faker-js/faker` 生成高质量的模拟数据：

- 预生成100条活动数据
- 预生成20条个人活动记录
- 自动生成价格、时间、评论等真实感数据

### 请求代理

项目使用 Vite 的代理功能进行请求转发，在 `vite.config.ts` 中配置：

- 示例🌰

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // 开发服务器地址
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
})
```

实际项目中，代理配置会将 `/api` 开头的请求转发到后端服务器，实现跨域请求处理。在开发环境中，如果启用了 Mock 功能，请求会被 MSW 拦截，不会真正发送到代理服务器。
