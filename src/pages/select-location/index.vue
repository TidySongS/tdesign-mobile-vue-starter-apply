<script setup lang="ts">
import { Toast } from 'tdesign-mobile-vue'
import cityList from '@/constant/cityList'
import userInfo from '@/store/userInfo'

const hotCityList = ['北京市', '上海市', '广州市', '深圳市', '成都市']
const indexList = cityList.map(item => item.index)
const router = useRouter()
const locationStatus = ref(false)

function formatCityName(name: string) {
  if (name.endsWith('市'))
    return name.slice(0, -1)
  return name
}

function updateCity(cityName: string) {
  userInfo.locationName = cityName
  router.back()
}

function updateLocation() {
  locationStatus.value = true
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        try {
          const cityName = await getCityNameFromCoords(latitude, longitude)
          if (cityName === '未知城市') {
            throw new Error('无法获取城市信息')
          }
          else {
            userInfo.locationName = cityName
            Toast({
              className: 'toast-root--success',
              theme: 'success',
              direction: 'column',
              message: '定位成功',
            })
          }
        }
        catch (error) {
          console.error('逆地理编码失败', error)
          Toast({
            theme: 'error',
            direction: 'column',
            message: '定位失败，请稍后重试',
          })
        }
        finally {
          locationStatus.value = false
        }
      },
      (error) => {
        locationStatus.value = false
        console.error('获取地理位置失败', error)
        let msg = ''
        switch (error.code) {
          case error.PERMISSION_DENIED:
            msg = '您拒绝了地理位置请求'
            break
          case error.POSITION_UNAVAILABLE:
            msg = '位置信息不可用'
            break
          case error.TIMEOUT:
            msg = '获取位置超时'
            break
          default:
            msg = '发生未知错误'
            break
        }
        Toast({
          theme: 'error',
          direction: 'column',
          message: msg,
        })
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      },
    )
  }
  else {
    locationStatus.value = false
    Toast('您的浏览器不支持地理位置服务')
  }
}

async function getCityNameFromCoords(
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
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) })
    if (!response.ok) {
      throw new Error('无法从腾讯地图获取城市名称')
    }
    const data = await response.json()
    if (data.status !== 0) {
      throw new Error(`腾讯地图 API 返回错误: ${data.message}`)
    }
    const city = data.result.address_component.city
    return city || '未知城市'
  }
  catch (error) {
    console.error('逆地理编码失败', error)
    throw error
  }
}
</script>

<template>
  <header>
    <t-navbar title="选择城市" left-arrow :on-left-click="$router.back" />
    <div class="location-container">
      <div class="flex-center">
        <t-icon name="location" size="24" />
        <t-loading
          v-if="locationStatus"
          theme="dots"
          size="24px"
          style="margin-left: 8px"
        />
        <span v-else>
          {{ userInfo.locationName }}
        </span>
      </div>
      <t-button
        theme="default"
        size="extra-small"
        shape="round"
        :disabled="locationStatus"
        @click="updateLocation"
      >
        {{ locationStatus ? "正在定位" : "更新定位" }}
      </t-button>
    </div>
  </header>
  <main>
    <div class="index-container">
      <t-indexes :index-list="indexList" :sticky="false">
        <div class="hot-city-container">
          <div class="hot-city-header">
            <span> 热门城市 </span>
          </div>
          <div
            v-for="(item, index) in hotCityList"
            :key="index"
            class="hot-city"
            @click="updateCity(item)"
          >
            {{ formatCityName(item) }}
            <t-icon
              v-if="userInfo.locationName === item"
              name="check"
              size="24"
              class="city-active-icon"
            />
          </div>
        </div>
        <template v-for="item in cityList" :key="item.index">
          <t-indexes-anchor :index="item.index" />
          <t-cell-group>
            <t-cell
              v-for="(val, i) in item.children"
              :key="i"
              :title="formatCityName(val)"
              @click="updateCity(val)"
            >
              <t-icon
                v-if="userInfo.locationName === val"
                name="check"
                size="24"
                class="city-active-icon"
              />
            </t-cell>
          </t-cell-group>
        </template>
      </t-indexes>
    </div>
  </main>
</template>

<style lang="less" scoped>
@import "@/style/home.less";

header {
  top: 0;
  z-index: 99;
  height: 104px;
  position: sticky;
  background: white;
  .location-container {
    .p-16();
    .flex-center();
    .font-templet(400,16px,24px);
    top: 48px;
    height: 24px;
    width: calc(100% - 32px);
    position: fixed;
    background: white;
    justify-content: space-between;
    span {
      margin-left: 4px;
    }
  }
}

.index-container {
  margin-top: 4px;
  .hot-city-container {
    .hot-city-header {
      .font-templet();
      height: 22px;
      padding: 4px 16px;
      background: var(--td-gray-color-1);
    }
    .hot-city {
      .flex-center();
      height: 23px;
      margin-left: 16px;
      padding: 16px 16px 16px 0;
      justify-content: space-between;
      border-bottom: 1px solid var(--td-gray-color-1);
    }
  }
  .city-active-icon {
    margin-right: 24px;
    color: var(--td-brand-color-7);
  }
}
</style>
