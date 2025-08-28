<script setup lang="ts">
import type { ActivityFilterParams as Filters, SortOption } from '@/api/activity'
import { getActivities, getHomeSwiper } from '@/api/activity'
import { useFilters } from '@/hooks/useFilters'
import { formatPrice } from '@/utils/formatters'

defineOptions({
  name: 'MainIndex',
})

interface Activity {
  id: number
  title: string
  cover: string
  score: number
  formattedPrice?: string
}

interface TabPanel {
  value: SortOption
  label: string
}

const searchValue = ref('')
const currentTab = ref<SortOption>('latest')
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
const swiperList = ref([])
const activityList = ref<Activity[]>([])

const tabPanels: TabPanel[] = [
  {
    value: 'latest',
    label: '最新活动',
  },
  {
    value: 'top',
    label: '高分活动',
  },
]

function processActivityResponse(res: any): Activity[] {
  if (!res || !res.data || !res.data.paginatedData) {
    throw new Error('API response format is invalid')
  }

  return res.data.paginatedData.map((item: any) => ({
    ...item,
    formattedPrice: formatPrice(item.minPrice, item.maxPrice),
  }))
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
      domain: filters.domain,
      type: filters.type,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      dateRange: filters.dateRange,
    }
    const res = await getActivities(payload)
    const paginatedData = processActivityResponse(res)
    if (isRefresh.value) {
      activityList.value = paginatedData
    }
    else {
      activityList.value.push(...paginatedData)
    }
    if (paginatedData.length < pageSize) {
      isLoadAllActivities.value = true
    }
    else {
      currentPage++
    }
    if (activityList.value.length === 0) {
      lastKnownScrollPosition.value = 0
    }
  }
  catch (error) {
    console.error('获取活动列表失败:', error)
  }
  finally {
    isFetchActivityList.value = false
  }
}

async function fetchSwiperList() {
  try {
    const res = await getHomeSwiper()
    if (!res || !res.data) {
      throw new Error('API response data is undefined')
    }
    swiperList.value = res.data
  }
  catch (error) {
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
  fetchSwiperList()
  fetchActivityList()
})

onDeactivated(() => {
  swiperReady.value = false
  scrollPosition.value = lastKnownScrollPosition.value
})

onActivated(() => {
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
      <ActivitySwiper
        :is-fetch-swiper-list
        :swiper-ready
        :swiper-list="swiperList"
      />
    </div>

    <div>
      <h2 style="padding-bottom: 0">
        全部活动
      </h2>
      <t-sticky :offset-top="104" :z-index="99">
        <div class="tab-container">
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
            class="filter-container"
            @click="filterPopupVisible = true"
          >
            <FilterIcon size="16" />
            <span style="margin-left: 2px;">筛选</span>
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
        <div v-if="isLoadAllActivities" class="no-more-activity">
          没有更多活动了哦～
        </div>
      </template>
      <router-link
        v-for="item in activityList"
        :key="item.id"
        :to="`/activity-detail/${item.id}`"
      >
        <ActivityCard :cover="item.cover" :title="item.title">
          <template #content>
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
          </template>
          <template #footer>
            <span class="price">{{
              item.formattedPrice
            }}</span>
          </template>
        </ActivityCard>
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

.tab-container {
  .flex-center();
  height: 48px;
  background: var(--bg-color-page);

  .t-tabs {
    flex: 2;
  }

  .filter-container {
    .flex-center();
    flex: 1;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 48px;
    &::before {
      content: '';
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

.rate-container {
  .font(12px, 600);
  margin-top: 8px;
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

.no-more-activity {
  .flex-center();
}
</style>
