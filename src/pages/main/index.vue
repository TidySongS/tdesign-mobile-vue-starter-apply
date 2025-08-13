<script setup lang="ts">
import TagFilter from '@/components/TagFilter.vue'

const searchValue = ref('')
const currentTab = ref('latest')
const filterVisible = ref(false)
const calendarVisible = ref(false)

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

const swiperList = [
  '/imgs/activity/sicc-2019.png',
  '/imgs/activity/sicc-2021.png',
  '/imgs/activity/sicc-2019.png',
  '/imgs/activity/sicc-2021.png',
  '/imgs/activity/sicc-2019.png',
  '/imgs/activity/sicc-2021.png',
]

const activityList = [
  {
    name: '少年与星空 插画巡展',
    cover: '/imgs/activity/cover-3.png',
    star: 4.5,
    price: '¥98.00-¥118.00',
  },
  {
    name: 'Universe AI艺术展',
    cover: '/imgs/activity/cover-4.png',
    star: 3.5,
    price: '¥128.00-¥228.00',
  },
  {
    name: '2019 SICC服务设计创新大会',
    cover: '/imgs/activity/cover-1.png',
    star: 5,
    price: '免费活动',
  },
  {
    name: '2021 SICC服务设计创新大会',
    cover: '/imgs/activity/cover-2.png',
    star: 4.5,
    price: '¥88.00-¥228.00',
  },
]

const fieldOriented = [
  'IT互联网',
  '艺术设计',
  '科技',
  '电商',
  '教育',
  '医疗健康',
  '心理学',
  '摄影',
]

const activityFormat = ['讲座', '展览', '工作坊']

const fieldFilter = ref(['IT互联网', '艺术设计'])

const formatFilter = ref(['讲座'])

const filteredActivityList = computed(() => {
  // mock
  const list = [...activityList]
  if (currentTab.value === 'top') {
    return list.sort((a, b) => b.star - a.star)
  }
  return list
})

function onTabChange($event: string | number) {
  currentTab.value = $event as string
}

const minDate = new Date(2023, 2, 1)
const maxDate = new Date()
const startDate = new Date(2023, 2, 5)
const endDate = new Date(2023, 2, 16)
const dateRange = ref([startDate, endDate])

function handleDateConfirm(val: any) {
  console.log(val)
}

function formatDateRange(startDate: Date, endDate: Date) {
  const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return [year, month, day]
  }
  const [startYear, startMonth, startDay] = formatDate(startDate)
  const [endYear, endMonth, endDay] = formatDate(endDate)
  if (startYear === endYear)
    return `${startYear}年${startMonth}月${startDay}日-${endMonth}月${endDay}日`
  return `${startYear}年${startMonth}月${startDay}日-${endYear}年${endMonth}月${endDay}日`
}

function handlePriceLabel(value: any) {
  return value
}
</script>

<template>
  <div style="touch-action: pan-y; overflow-x: hidden">
    <t-sticky :offset-top="48" :z-index="99">
      <div class="search-container">
        <t-search v-model="searchValue" :clearable="true" shape="round" placeholder="搜索活动" />
      </div>
    </t-sticky>

    <div class="wrapper">
      <h2>热门推荐</h2>
      <t-swiper
        :height="159.19" :autoplay="true" :navigation="{ type: 'dots', placement: 'outside' }" :style="{
          overflow: 'visible',
          margin: '0 calc((100vw - 283px) / 2 - 12px)',
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
          <t-tabs :default-value="currentTab" :split="false" :show-bottom-line="false" @change="onTabChange">
            <t-tab-panel v-for="(item, index) in tabPanels" :key="index" :value="item.value" :label="item.label" />
          </t-tabs>
          <div class="filter-container" @click="filterVisible = true">
            <t-icon name="filter" />
            <span>筛选</span>
          </div>
        </div>
      </t-sticky>
      <t-divider style="margin: 0" />
      <div class="card-container">
        <div v-for="(item, index) in filteredActivityList" :key="index" class="card">
          <div class="card-cover">
            <img :src="item.cover" :alt="item.name">
          </div>
          <div class="card-content">
            <h3>{{ item.name }}</h3>
            <div class="rate-container">
              <t-rate v-model="item.star" size="16" variant="filled" allow-half disabled />
              <span>{{ item.star }}分</span>
            </div>
            <span class="price">{{ item.price }}</span>
          </div>
        </div>
      </div>
    </div>

    <t-popup v-model="filterVisible" placement="bottom">
      <div class="popup-container popup-wrapper">
        <div class="popup-title">
          <span> 全部筛选 </span>
          <t-icon name="close" size="24" @click="filterVisible = false" />
        </div>

        <TagFilter v-model:model-value="fieldFilter" title="面向领域" :options="fieldOriented" />
        <TagFilter v-model:model-value="formatFilter" title="活动形式" :options="activityFormat" />

        <t-divider />

        <div>
          <h4>活动日期</h4>
          <div class="date-range-container">
            <span>{{ formatDateRange(dateRange[0], dateRange[1]) }}</span>
            <t-button theme="default" size="extra-small" shape="round" @click="calendarVisible = true">
              选择日期
            </t-button>
          </div>
        </div>

        <t-divider />

        <div>
          <h4>价格范围(元)</h4>
          <t-slider range :default-value="[158, 388]" :max="588" :label="handlePriceLabel" show-extreme-value />
        </div>
        <div class="popup-button-group">
          <t-button theme="light" variant="base" type="reset" size="large">
            重置
          </t-button>
          <t-button theme="primary" type="submit" size="large">
            完成
          </t-button>
        </div>
      </div>
    </t-popup>

    <t-popup v-model="calendarVisible" placement="bottom" :overlay-props="{ backgroundColor: 'transparent' }">
      <div class="popup-container calendar-container">
        <t-calendar :use-popup="false" :min-date="minDate" :max-date="maxDate" :value="dateRange" type="range">
          <template #title>
            <div class="calendar-title-wrapper">
              <t-icon name="chevron-left" size="24" />
              <div class="calendar-title">
                选择日期
              </div>
              <t-icon name="close" size="24" @click="calendarVisible = false" />
            </div>
          </template>
        </t-calendar>
        <div class="confirm-date-btn">
          <t-button theme="primary" size="large" @click="handleDateConfirm">
            确定日期
          </t-button>
        </div>
      </div>
    </t-popup>
  </div>
</template>

<style scoped lang="less">
.p-16 {
  padding: 16px;
}

.font-templet(@w: 400, @s: 14px, @h: 22px) {
  color: var(--td-text-color-primary);
  font-weight: @w;
  font-size: @s;
  line-height: @h;
}

.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

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

.popup-container {
  padding: 16px 0;
  max-height: calc(100vh - 117px);
  overflow-y: auto;
}

.popup-wrapper {
  .p-16();

  .popup-title {
    .flex-center();
    .font-templet(600, 18px, 26px);
    width: 100%;
    height: 26px;
    margin-bottom: 14px;

    span {
      padding-left: 24px;
      flex: 1;
      text-align: center;
    }
  }

  h4 {
    .font-templet(600, 14px, 22px);
    margin: 0;
  }

  .t-divider {
    margin: 24px 0;
  }

  .date-range-container {
    .flex-center();
    .font-templet(400, 16px, 24px);
    margin-top: 8px;
    justify-content: space-between;
  }

  .t-slider {
    .font-templet();
    padding-bottom: 24px;

    :deep(.t-slider__range-extreme) {
      .font-templet(400, 16px, 24px);
    }
  }

  .popup-button-group {
    .flex-center();
    margin-top: 16px;
    width: 100%;
    gap: 8px;

    button {
      width: 50%;
    }
  }
}

.calendar-container {
  :deep(.t-calendar__title) {
    padding-top: 0;
  }

  :deep(.t-calendar__days) {
    .t-calendar__days-item {
      &::before {
        content: "周";
      }
    }
  }

  .calendar-title-wrapper {
    .flex-center();
    width: 100%;

    .calendar-title {
      margin: auto;
    }
  }

  :deep(.t-calendar__months) {
    height: 458px;
  }

  .confirm-date-btn {
    .flex-center();
    padding: 16px;

    .t-button {
      flex: 1;
    }
  }
}
</style>
