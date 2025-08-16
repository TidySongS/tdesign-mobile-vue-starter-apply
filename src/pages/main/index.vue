<script setup lang="ts">
import type { Activity, Filters } from '@/types/interface'
import { useFilters } from '@/hooks/useFilters'
import {
  activityList as staticActivityList,
  swiperList as staticSwiperList,
} from '@/mocks/activityMocks'
import axios from '@/services/index'

const router = useRouter()
const searchValue = ref('')
const currentTab = ref('latest')
const isFetchSwiperList = ref(true)
const isFetchActivityList = ref(true)
const isLoadAllActivities = ref(false)
const isRefreshActivityList = ref(true)
const filterPopupVisible = ref(false)
const pageSize = 5
let currentPage = 1

const { filters, resetFilters } = useFilters()

const swiperList = ref<string[]>([])

const activityList = ref<Activity[]>([])

const tabPanels = [
  {
    value: 'latest',
    label: '最新活动',
  },
  {
    value: 'top',
    label: '高分活动',
  },
]

function goToActivityDetail(id: number | string) {
  router.push(`/activity-detail/${id}`)
}

async function fetchActivityList(isRefreshMode = true) {
  if (isLoadAllActivities.value && !isRefreshMode) {
    return
  }
  isRefreshActivityList.value = isRefreshMode
  isFetchActivityList.value = true
  if (isRefreshActivityList.value) {
    currentPage = 1
    isLoadAllActivities.value = false
  }
  try {
    let result
    if (import.meta.env.VITE_DATA_SOURCE === 'static') {
      const total = staticActivityList.length
      const sortedData = [...staticActivityList]
      if (currentTab.value === 'top') {
        sortedData.sort((a, b) => b.star - a.star)
      }
      else if (currentTab.value === 'latest') {
        sortedData.sort(
          (a, b) => b.dateRange[0].getTime() - a.dateRange[0].getTime(),
        )
      }
      result = { data: sortedData, total }
    }
    else {
      const payload = {
        sort: currentTab.value,
        page: currentPage,
        pageSize,
        filters: JSON.stringify(filters),
      }
      const { data: axiosResult } = await axios.get('/api/getFilteredActivittList', {
        params: payload,
      })
      result = axiosResult
    }
    if (isRefreshActivityList.value) {
      activityList.value = result.data
    }
    else {
      activityList.value.push(...result.data)
    }
    currentPage++

    if (activityList.value.length >= result.total) {
      isLoadAllActivities.value = true
    }
  }
  catch (error: any) {
    if (error?.name === 'AbortError') {
      console.log('请求被取消')
      return
    }
    console.error('获取活动列表失败:', error)
  }
  finally {
    isFetchActivityList.value = false
  }
}

async function fetchSwiperList() {
  try {
    if (import.meta.env.VITE_DATA_SOURCE === 'static') {
      swiperList.value = staticSwiperList
    }
    else {
      const { data: result } = await axios.get('/api/getSwiperList')
      swiperList.value = result.data
    }
  }
  catch (error: any) {
    console.error('获取轮播图列表失败:', error)
  }
  finally {
    isFetchSwiperList.value = false
  }
}

function resetAndFetch() {
  resetFilters()
  fetchActivityList()
  filterPopupVisible.value = false
}

function handleFiltersUpdate(newFilters: Filters) {
  Object.assign(filters, newFilters)
  fetchActivityList()
}

function handlePageScroll() {
  if (isLoadAllActivities.value)
    return
  const scrollHeight = document.documentElement.scrollHeight
  const scrollTop
    = document.documentElement.scrollTop || document.body.scrollTop
  const clientHeight = document.documentElement.clientHeight
  const scrollBottom = scrollHeight - scrollTop - clientHeight
  if (scrollBottom < 50 && !isFetchActivityList.value) {
    fetchActivityList(false)
  }
}

onMounted(() => {
  fetchSwiperList()
  fetchActivityList()
  window.addEventListener('scroll', handlePageScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handlePageScroll)
})

function formatPrice(priceRange: number[]): string {
  if (priceRange.length === 2 && priceRange[1] !== 0) {
    return `¥${priceRange[0].toFixed(2)}-¥${priceRange[1].toFixed(2)}`
  }
  else if (priceRange.length === 1 && priceRange[0] !== 0) {
    return `¥${priceRange[0].toFixed(2)}`
  }
  return '免费活动'
}
</script>

<template>
  <div class="page-container">
    <t-sticky :offset-top="48" :z-index="99">
      <div class="search-container">
        <t-search
          v-model="searchValue"
          :clearable="true"
          shape="round"
          placeholder="搜索活动"
        />
      </div>
    </t-sticky>

    <div class="wrapper">
      <h2>热门推荐</h2>
      <Transition name="swiper-fade" mode="out-in">
        <div
          v-if="isFetchSwiperList"
          key="swiper-placeholder"
          class="swiper-placeholder-container"
        >
          <div class="swiper-placeholder">
            <div
              class="swiper-side swiper-img"
              style="border-radius: 0 9px 9px 0"
            />
            <div class="swiper-main swiper-img" />
            <div
              class="swiper-side swiper-img"
              style="border-radius: 9px 0 0 9px"
            />
          </div>
          <div class="dots-placeholder">
            <t-loading theme="dots" :duration="5000" size="30px" />
          </div>
        </div>
        <t-swiper
          v-else
          key="swiper"
          :height="159.2"
          :autoplay="true"
          :navigation="{ type: 'dots', placement: 'outside' }"
          :style="{
            overflow: 'visible',
            margin: '0 calc(50vw - 153.5px) 0 calc(50vw - 141.5px)',
          }"
        >
          <t-swiper-item
            v-for="(item, index) in swiperList"
            :key="`swiper-${index}`"
          >
            <img :src="item">
          </t-swiper-item>
        </t-swiper>
      </Transition>
    </div>

    <div class="wrapper flex-fill-col">
      <h2 style="padding-bottom: 0">
        全部活动
      </h2>
      <t-sticky :offset-top="104" :z-index="99">
        <div class="tab-wrapper">
          <t-tabs
            v-model:value="currentTab"
            :split="false"
            :show-bottom-line="false"
            @change="fetchActivityList()"
          >
            <t-tab-panel
              v-for="(item, index) in tabPanels"
              :key="`tab-${index}`"
              :value="item.value"
              :label="item.label"
            />
          </t-tabs>
          <div class="filter-container" @click="filterPopupVisible = true">
            <t-icon name="filter" />
            <span>筛选</span>
          </div>
        </div>
      </t-sticky>
      <t-divider style="margin: 0" />

      <Transition name="fade" mode="out-in">
        <div
          v-if="!isFetchActivityList && activityList.length === 0"
          key="empty"
          class="empty-result-container"
        >
          <t-result>
            <template #image>
              <t-image
                src="https://tdesign.gtimg.com/mobile/demos/result1.png"
                class="external-class-image"
              />
            </template>
            <template #title>
              <div style="font-size: large">
                暂无相关活动
              </div>
            </template>
            <template #description>
              <div>换个筛选条件试试，或许有惊喜哦～</div>
            </template>
          </t-result>
        </div>
        <div
          v-else-if="isFetchActivityList && isRefreshActivityList"
          key="skeleton"
          class="card-container"
        >
          <ActivityCardSkeleton />
        </div>
        <div v-else class="card-container">
          <div
            v-for="item in activityList"
            :key="`activity-${item.id}`"
            class="card"
            @click="goToActivityDetail(item.id)"
          >
            <div class="card-cover">
              <img :src="item.cover" :alt="item.name">
            </div>
            <div class="card-content">
              <h3>{{ item.name }}</h3>
              <div class="rate-container">
                <t-rate
                  v-model="item.star"
                  size="16"
                  variant="filled"
                  allow-half
                  disabled
                />
                <span>{{ item.star }}分</span>
              </div>
              <span class="price">{{ formatPrice(item.priceRange) }}</span>
            </div>
          </div>
          <div
            v-if="!isRefreshActivityList && isFetchActivityList"
            key="skeleton-more"
          >
            <ActivityCardSkeleton :count="1" />
          </div>
        </div>
      </Transition>
    </div>

    <ActivityFilterPopup
      v-model:visible="filterPopupVisible"
      :filters
      @reset="resetAndFetch"
      @update:filters="handleFiltersUpdate"
    />
  </div>
</template>

<style scoped lang="less">
@import "@/style/home.less";
.page-container {
  .flex-col();
  touch-action: pan-y;
  overflow-x: hidden;
  overflow-y: auto;
  min-height: calc(100vh - 104px);
}

.search-container {
  padding: 8px 16px;
  background-color: white;
}

.wrapper {
  .flex-col();
  h2 {
    .p-16();
    .font-templet(600, 20px, 28px);
    margin: 0;
  }
}

.swiper-placeholder-container {
  .flex-col();
  height: 177.19px;
  .swiper-placeholder {
    flex-grow: 1;
    .flex-center();
    .swiper-main {
      width: 283px;
      margin: 0 12px;
    }
    .swiper-img {
      height: 100%;
      border-radius: var(--td-radius-large);
      background-color: var(--td-gray-color-1);
    }
    .swiper-side {
      width: calc(50vw - 153.5px);
    }
  }
  .dots-placeholder {
    display: flex;
    height: 18px;
    .t-loading {
      bottom: 0;
      margin: auto;
    }
  }
}

.t-swiper img {
  width: 283px;
  height: 100%;
  object-fit: cover;
  border-radius: var(--td-radius-large);
  box-shadow: var(--td-shadow-3);
}

.tab-wrapper {
  .flex-center ();
  .font-templet();
  background-color: white;

  :deep(.t-tabs) {
    flex: 2;
  }

  .filter-container {
    flex: 1;
    .flex-center();
    border-left: 1px solid var(--td-border-level-1-color);
  }
}

.swiper-fade-enter-active {
  transition: opacity 0.5s ease;
}

.swiper-fade-enter-from {
  opacity: 0;
}

.fade-enter-active {
  transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.empty-result-container {
  .flex-center();
  flex: 1;
}

.card-container {
  margin-bottom: 56px;
  .card {
    .card-cover {
      flex-shrink: 0;
      width: 120px;
      height: 100%;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .card-content {
      h3 {
        .font-templet();
        margin: 0 0 8px 0;
      }

      .rate-container {
        .font-templet(600, 12px, 20px);
        display: flex;
        color: var(--td-warning-color-5);

        span {
          margin-left: 8px;
        }

        :deep(.t-rate__icon--selected),
        :deep(.t-rate__icon-left--selected) {
          color: var(--td-warning-color-5);
        }
      }
    }
  }
}
</style>
