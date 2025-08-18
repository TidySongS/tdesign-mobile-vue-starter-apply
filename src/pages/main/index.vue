<script setup lang="ts">
import type { Activity, Filters } from '@/types/interface'
import { getActivities, getHomeSwiper } from '@/api/activity'
import { useFilters } from '@/hooks/useFilters'

interface SwiperItem {
  id: string
  name: string
  url: string
}

const router = useRouter()
const searchValue = ref('')
const currentTab = ref('latest')
const isRefresh = ref(true)
const isFetchSwiperList = ref(true)
const isFetchActivityList = ref(true)
const isLoadAllActivities = ref(false)
const filterPopupVisible = ref(false)
const pageSize = 5
let currentPage = 1

const { filters, resetFilters } = useFilters()

const swiperList = ref<SwiperItem[]>([])

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
  isRefresh.value = isRefreshMode
  isFetchActivityList.value = true
  if (isRefresh.value) {
    currentPage = 1
    isLoadAllActivities.value = false
  }
  try {
    const payload = {
      sort: currentTab.value,
      page: currentPage,
      pageSize,
      filters: JSON.stringify(filters),
    }
    const res = await getActivities(payload)
    if (isRefresh.value) {
      activityList.value = res.data.paginatedData
    }
    else {
      activityList.value.push(...res.data.paginatedData)
    }
    currentPage++
    if (activityList.value.length >= res.data.total) {
      isLoadAllActivities.value = true
    }
  }
  catch (error: any) {
    console.error('获取活动列表失败:', error)
  }
  finally {
    isFetchActivityList.value = false
  }
}

async function fetchSwiperList() {
  try {
    const res = await getHomeSwiper()
    swiperList.value = res.data
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

function throttle(fn: any, delay: number) {
  let timer: ReturnType<typeof setTimeout> | null = null
  return function (this: any, ...args: any[]) {
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, args)
        timer = null
      }, delay)
    }
  }
}

function handlePageScroll() {
  if (isLoadAllActivities.value)
    return
  const scrollHeight = document.documentElement.scrollHeight
  const scrollTop
    = document.documentElement.scrollTop || document.body.scrollTop
  const clientHeight = document.documentElement.clientHeight
  const scrollBottom = scrollHeight - scrollTop - clientHeight
  if (scrollBottom < scrollHeight * 0.2 && !isFetchActivityList.value) {
    fetchActivityList(false)
  }
}

const throttledScrollHandler = throttle(handlePageScroll, 200)

onMounted(() => {
  fetchSwiperList()
  fetchActivityList()
  window.addEventListener('scroll', throttledScrollHandler)
})

onUnmounted(() => {
  window.removeEventListener('scroll', throttledScrollHandler)
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
  <div class="page-container flex-col">
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

    <div class="recommend-container">
      <h2>热门推荐</h2>
      <Transition name="swiper-fade" mode="out-in">
        <div
          v-if="isFetchSwiperList"
          key="swiper-placeholder"
          class="swiper-placeholder-container flex-col"
        >
          <div class="swiper-placeholder flex-center">
            <div
              class="swiper-placeholder__side swiper-img"
              style="border-radius: 0 9px 9px 0"
            />
            <div class="swiper-placeholder__main swiper-img" />
            <div
              class="swiper-placeholder__side swiper-img"
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
          class="swiper"
        >
          <t-swiper-item v-for="item in swiperList" :key="item.id">
            <img :src="item.url" :alt="item.name">
          </t-swiper-item>
        </t-swiper>
      </Transition>
    </div>

    <div class="activity-container flex-fill-col">
      <h2 style="padding-bottom: 0">
        全部活动
      </h2>
      <t-sticky :offset-top="104" :z-index="99">
        <div class="tab-wrapper flex-center">
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
          <div
            class="filter-container flex-center"
            @click="filterPopupVisible = true"
          >
            <t-icon name="filter" size="16" />
            <span>筛选</span>
          </div>
        </div>
      </t-sticky>
      <t-divider style="margin: 0" />
      <!-- <Transition name="fade" mode="out-in"> -->
      <div
        v-if="!isFetchActivityList && activityList.length === 0"
        key="empty"
        class="empty-result-container slide-in-animation"
      >
        <t-result>
          <template #image>
            <t-image src="/imgs/result1.png" />
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
        v-else-if="isFetchActivityList && isRefresh"
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
          <div class="card__cover">
            <img :src="item.cover" :alt="item.name">
          </div>
          <div class="card__content">
            <h3>{{ item.name }}</h3>
            <div class="rate-container">
              <t-rate
                v-model="item.score"
                size="16"
                variant="filled"
                allow-half
                disabled
              />
              <span>{{ item.score }}分</span>
            </div>
            <span class="price">{{ formatPrice(item.priceRange) }}</span>
          </div>
        </div>
        <div v-if="!isRefresh && isFetchActivityList" key="skeleton-more">
          <ActivityCardSkeleton :count="1" />
        </div>
      </div>
      <!-- </Transition> -->
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
  touch-action: pan-y;
  overflow-x: hidden;
  overflow-y: auto;
  min-height: calc(100vh - var(--navbar-height) - var(--tabbar-height));
}

.search-container {
  padding: 8px 16px;
  background: var(--bg-color-page);
}

.recommend-container,
.activity-container {
  h2 {
    .p-16();
    .font(20px, 600);
  }
}

.swiper-placeholder-container {
  height: calc(var(--swiper-height) + 18px);
}

.dots-placeholder {
  display: flex;
  height: 18px;
  .t-loading {
    bottom: 0;
    margin: auto;
  }
}

.swiper-placeholder {
  flex-grow: 1;
  &__main {
    width: var(--swiper-width);
    margin: 0 12px;
  }
  .swiper-img {
    height: 100%;
    border-radius: var(--td-radius-large);
    background-color: var(--gray-color-1);
  }
  &__side {
    width: calc((100vw - var(--swiper-width)) / 2 - 12px);
  }
}

.swiper {
  overflow: visible;
  margin: 0 calc((100vw - var(--swiper-width)) / 2 - 12px) 0
    calc((100vw - var(--swiper-width)) / 2);
  img {
    width: var(--swiper-width);
    height: 100%;
    object-fit: cover;
    border-radius: var(--td-radius-large);
    box-shadow: var(--shadow);
  }
}

.tab-wrapper {
  background: var(--bg-color-page);

  :deep(.t-tabs) {
    flex: 2;
  }

  .filter-container {
    flex: 1;
    border-left: 1px solid var(--td-border-level-1-color);
  }
}

.swiper-fade-enter-active {
  transition: opacity 1s ease;
}

.swiper-fade-enter-from {
  opacity: 0;
}

// .fade-enter-active {
//   transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
// }
// .fade-enter-from {
//   opacity: 0;
//   transform: translateY(4px);
// }

.empty-result-container {
  .flex-center();
  margin-bottom: 4px;
  flex: 1;
}

@keyframes slide-in {
  0% {
    opacity: 0;
    transform: translateY(4px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-in-animation {
  animation: slide-in 0.5s ease-in-out forwards;
}

.card-container {
  margin-bottom: 56px;
}

.card {
  &__cover {
    flex-shrink: 0;
    width: var(--card-height);
    height: 100%;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__content {
    h3 {
      .font();
      margin-bottom: 8px;
    }
  }
}

.rate-container {
  .font(12px, 600);
  display: flex;
  color: var(--star-color);

  span {
    margin-left: 8px;
  }

  :deep(.t-rate__icon--selected),
  :deep(.t-rate__icon-left--selected) {
    color: var(--star-color);
  }
}
</style>
