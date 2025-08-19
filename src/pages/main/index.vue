<script setup lang="ts">
import type { Activity, Filters } from '@/types/interface'
import { getActivities, getHomeSwiper } from '@/api/activity'
import { useFilters } from '@/hooks/useFilters'

defineOptions({
  name: 'MainIndex',
})

interface SwiperItem {
  id: string
  name: string
  url: string
}

const searchValue = ref('')
const currentTab = ref('latest')
const isRefresh = ref(true)
const pageContainerRef = ref<any | null>(null)
const scrollPosition = ref(0)
const lastKnownScrollPosition = ref(0)
const swiperReady = ref(false)
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

function formatPrice(minPrice: number, maxPrice: number): string {
  if (minPrice === 0 && maxPrice === 0)
    return '免费活动'
  if (minPrice === maxPrice)
    return `¥${minPrice.toFixed(2)}`
  return `¥${minPrice.toFixed(2)}-¥${maxPrice.toFixed(2)}`
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

function onScroll(scrollBottom: number, scrollTop: number) {
  lastKnownScrollPosition.value = scrollTop
  if (
    !isFetchActivityList.value
    && !isLoadAllActivities.value
    && scrollBottom < 56
  ) {
    fetchActivityList(false)
  }
}

onMounted(() => {
  fetchActivityList()
})

onDeactivated(() => {
  swiperReady.value = false
  scrollPosition.value = lastKnownScrollPosition.value
})

onActivated(() => {
  if (swiperList.value.length === 0) {
    fetchSwiperList()
  }
  nextTick(() => {
    swiperReady.value = true
    if (scrollPosition.value > 0) {
      if (pageContainerRef.value) {
        const offsetHeight = 104
        let scrollTop = 0
        if (scrollPosition.value < offsetHeight)
          scrollTop = scrollPosition.value
        else scrollTop = scrollPosition.value - offsetHeight
        pageContainerRef.value.scrollTop = scrollTop
      }
    }
  })
})
</script>

<template>
  <div ref="pageContainerRef" class="page-container">
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

    <div>
      <h2>热门推荐</h2>
      <!-- <Transition name="swiper-fade" mode="out-in"> -->
      <div class="swiper-container">
        <div v-if="isFetchSwiperList" key="swiper-placeholder" class="flex-col">
          <div class="swiper-placeholder">
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
            <t-loading
              :pause="swiperReady"
              theme="dots"
              :duration="5000"
              size="30px"
            />
          </div>
        </div>
        <div
          v-else-if="swiperList.length === 0"
          key="empty-swiper-placeholder"
          class="swiper-placeholder"
        >
          <div class="swiper-placeholder__main swiper-img">
            <span>暂无轮播图数据</span>
          </div>
        </div>

        <t-swiper
          v-else-if="swiperReady"
          key="swiper"
          :height="159.2"
          :autoplay="true"
          :navigation="{ type: 'dots', placement: 'outside' }"
          class="swiper"
        >
          <t-swiper-item v-for="item in swiperList" :key="item.id">
            <t-image :src="item.url" :alt="item.name" fit="cover" />
          </t-swiper-item>
        </t-swiper>
      </div>
      <!-- </Transition> -->
    </div>

    <div>
      <h2 style="padding-bottom: 0">
        全部活动
      </h2>
      <t-sticky :offset-top="104" :z-index="99">
        <div class="tab-container flex-center">
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
    </div>

    <t-divider style="margin: 0" />
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

    <t-list v-else @scroll="onScroll">
      <template #footer>
        <div v-if="isLoadAllActivities" class="flex-center">
          没有更多活动了哦～
        </div>
      </template>
      <router-link
        v-for="item in activityList"
        :key="item.id"
        class="card"
        :to="`/activity-detail/${item.id}`"
      >
        <div class="card__cover">
          <t-image :src="item.cover" :alt="item.title" fit="cover" />
        </div>
        <div class="card__content">
          <h3>{{ item.title }}</h3>
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
          <span class="price">{{
            formatPrice(item.minPrice, item.maxPrice)
          }}</span>
        </div>
      </router-link>
      <div v-if="!isRefresh && isFetchActivityList" key="skeleton-more">
        <ActivityCardSkeleton :count="1" />
      </div>
    </t-list>

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
  max-height: calc(100vh - var(--navbar-height) - var(--tabbar-height));
  .t-list {
    margin-bottom: 16px;
  }
}

.search-container {
  padding: 8px 16px;
  background: var(--bg-color-page);
}

h2 {
  .p-16();
  .font(20px, 600);
}

.swiper-container {
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
  height: var(--swiper-height);
  .flex-center();
  flex-grow: 1;
  &__main {
    .flex-center();
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
  .t-image {
    width: var(--swiper-width);
    height: 100%;
    box-shadow: var(--shadow);
  }
}

.tab-container {
  height: 48px;
  background: var(--bg-color-page);

  .t-tabs {
    flex: 2;
  }

  .filter-container {
    flex: 1;
    position: relative;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 48px;
    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 1px;
      height: 22px;
      background-color: var(--td-border-level-1-color);
    }
  }
}

.empty-result-container {
  .flex-center();
  margin-top: 16px;
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

.card {
  &__cover {
    flex-shrink: 0;
    width: var(--card-height);
    height: 100%;

    .t-image {
      height: var(--card-height);
      width: 100%;
    }
  }

  &__content {
    flex: 1;
    min-width: 0;
    h3 {
      .font();
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
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
