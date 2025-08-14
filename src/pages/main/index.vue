<script setup lang="ts">
const router = useRouter()
const searchValue = ref('')
const currentTab = ref('latest')
const filterPopupVisible = ref(false)

const filters = reactive({
  fields: ['IT互联网', '艺术设计'],
  formats: ['讲座'],
  priceRange: [158, 388],
  dateRange: [new Date(2023, 2, 10), new Date(2023, 2, 18)],
})

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

const mockedSwiperList = [
  '/imgs/activity/sicc-2019.png',
  '/imgs/activity/sicc-2021.png',
  '/imgs/activity/sicc-2019.png',
  '/imgs/activity/sicc-2021.png',
  '/imgs/activity/sicc-2019.png',
  '/imgs/activity/sicc-2021.png',
]

const mockedActivityList = [
  {
    id: 1,
    name: '少年与星空 插画巡展',
    cover: '/imgs/activity/cover-3.png',
    star: 4.5,
    price: '¥98.00-¥118.00',
  },
  {
    id: 2,
    name: 'Universe AI艺术展',
    cover: '/imgs/activity/cover-4.png',
    star: 3.5,
    price: '¥128.00-¥228.00',
  },
  {
    id: 3,
    name: '2019 SICC服务设计创新大会',
    cover: '/imgs/activity/cover-1.png',
    star: 5,
    price: '免费活动',
  },
  {
    id: 4,
    name: '2021 SICC服务设计创新大会',
    cover: '/imgs/activity/cover-2.png',
    star: 4.5,
    price: '¥88.00-¥228.00',
  },
]

const defaultFilterOptions = {
  fieldOriented: [
    'IT互联网',
    '艺术设计',
    '科技',
    '电商',
    '教育',
    '医疗健康',
    '心理学',
    '摄影',
  ],
  activityFormat: ['讲座', '展览', '工作坊'],
  minPrice: 0,
  maxPrice: 588,
  minDate: new Date(2023, 2, 1),
  maxDate: new Date(),
}

const swiperList = mockedSwiperList
const activityList = mockedActivityList

function goToActivityDetail(id: number | string) {
  router.push(`/activity-detail/${id}`)
}

function fetchActivityList() {
  console.log('fetch activity list')
}

function handleFiltersUpdate(newFilters: any) {
  Object.assign(filters, newFilters)
  fetchActivityList()
}
</script>

<template>
  <div style="touch-action: pan-y; overflow-x: hidden">
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
      <t-swiper
        :height="159.2"
        :autoplay="true"
        :navigation="{ type: 'dots', placement: 'outside' }"
        :style="{
          overflow: 'visible',
          margin: '0 calc(50vw - 153.5px) 0 calc(50vw - 141.5px)',
        }"
      >
        <t-swiper-item v-for="(item, index) in swiperList" :key="index">
          <img :src="item">
        </t-swiper-item>
      </t-swiper>
    </div>

    <div class="wrapper">
      <h2 style="padding-bottom: 0">
        全部活动
      </h2>
      <t-sticky :offset-top="104" :z-index="99">
        <div class="tab-wrapper">
          <t-tabs
            :default-value="currentTab"
            :split="false"
            :show-bottom-line="false"
            @change="fetchActivityList"
          >
            <t-tab-panel
              v-for="(item, index) in tabPanels"
              :key="index"
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
      <div class="card-container">
        <div
          v-for="item in activityList"
          :key="item.id"
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
            <span class="price">{{ item.price }}</span>
          </div>
        </div>
      </div>
    </div>

    <ActivityFilterPopup
      v-model:visible="filterPopupVisible"
      :filters
      :options="defaultFilterOptions"
      @update:filters="handleFiltersUpdate"
    />
  </div>
</template>

<style scoped lang="less">
@import "@/style/home.less";

.search-container {
  padding: 8px 16px;
  background-color: white;
}

.wrapper {
  h2 {
    .p-16();
    .font-templet(600, 20px, 28px);
    margin: 0;
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

.card-container {
  margin-bottom: 72px;

  .card {
    display: flex;
    height: 120px;
    margin: 16px;
    border-radius: var(--td-radius-large);
    box-shadow: var(--td-shadow-3);
    overflow: hidden;

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
      .p-16();
      padding-bottom: 12px;
      width: 100%;
      display: flex;
      flex-direction: column;

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

      .price {
        .font-templet(600, 14px, 22px);
        margin-top: auto;
      }
    }
  }
}
</style>
