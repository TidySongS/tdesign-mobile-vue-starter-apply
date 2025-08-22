// 这里导入的是全局的 axios 实例
// 请求 url(/api/tencent-map/...) 会直接通过 Vite 的代理规则
import axios from 'axios'

export function getCityNameFromCoords(
  latitude: number,
  longitude: number,
): Promise<string> {
  const tencentApiKey = import.meta.env.VITE_TENCENT_MAP_API_KEY
  if (!tencentApiKey) {
    throw new Error(
      '腾讯地图 API Key 缺失，请在 .env 文件中设置 VITE_TENCENT_MAP_API_KEY',
    )
  }
  const url = `/api/tencent-map/ws/geocoder/v1/?location=${latitude},${longitude}&key=${tencentApiKey}`

  return axios
    .get(url, { timeout: 5000 })
    .then((response) => {
      const data = response.data
      if (data.status !== 0) {
        throw new Error(`腾讯地图 API 返回错误: ${data.message}`)
      }
      const city = data.result.address_component.city
      return city || '未知城市'
    })
    .catch((error) => {
      console.error('逆地理编码失败', error)
      if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
        throw new Error('请求超时')
      }
      throw error
    })
}
