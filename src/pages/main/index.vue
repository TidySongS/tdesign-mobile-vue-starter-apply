<script setup lang="ts">
const searchValue = ref("");
const swiperList = [
  "/imgs/activity/sicc-2019.png",
  "/imgs/activity/sicc-2021.png",
  "/imgs/activity/sicc-2019.png",
  "/imgs/activity/sicc-2021.png",
  "/imgs/activity/sicc-2019.png",
  "/imgs/activity/sicc-2021.png",
];
const currentTab = ref("1");
const tabPanels = [
  {
    value: "1",
    label: "最新活动",
  },
  {
    value: "2",
    label: "高分活动",
  },
];

const activityList = [
  {
    name: "少年与星空 插画巡展",
    cover: "/imgs/activity/cover-3.png",
    star: 4.5,
    price: "¥98.00-¥118.00",
  },
  {
    name: "Universe AI艺术展",
    cover: "/imgs/activity/cover-4.png",
    star: 3.5,
    price: "¥128.00-¥228.00",
  },
  {
    name: "2019 SICC服务设计创新大会",
    cover: "/imgs/activity/cover-1.png",
    star: 5,
    price: "免费活动",
  },
  {
    name: "2021 SICC服务设计创新大会",
    cover: "/imgs/activity/cover-2.png",
    star: 4.5,
    price: "¥88.00-¥228.00",
  },
];

const filteredActivityList = computed(() => {
  // mock
  let list = [...activityList];
  if (currentTab.value === "2") {
    return list.sort((a, b) => b.star - a.star);
  }
  return list;
});

const filterVisible = ref(false);

const onTabChange = ($event: string | number, label: string) => {
  currentTab.value = $event as string;
};
</script>

<template>
  <div>
    <t-sticky :offset-top="48" :z-index="99">
      <div class="search-container">
        <t-search v-model="searchValue" :clearable="true" shape="round" placeholder="搜索活动"></t-search>
      </div>
    </t-sticky>
    <div class="subtitle">
      <h2>热门推荐</h2>
    </div>
    <t-swiper :height="159.19" :autoplay="true" :navigation="{ type: 'dots', placement: 'outside' }">
      <t-swiper-item v-for="(item, index) in swiperList" :key="index">
        <img :src="item" class="swiper-img" />
      </t-swiper-item>
    </t-swiper>
    <div class="subtitle">
      <h2 style="padding-bottom: 0">全部活动</h2>
    </div>
    <t-sticky :offset-top="104" :z-index="99">
      <div class="tab-wrapper">
        <t-tabs :default-value="currentTab" :split="false" :showBottomLine="false" @change="onTabChange">
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
      <div class="card" v-for="(item, index) in filteredActivityList" :key="index">
        <div class="card-cover">
          <img :src="item.cover" :alt="item.name" />
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
    <t-popup v-model="filterVisible" placement="bottom" style="padding: 16px">
      <div class="header">
        <div class="popup-title">全部筛选</div>
        <t-icon name="close" @click="filterVisible = false" size="18" />
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

.subtitle {
  h2 {
    .p-16();
    .font-templet(600, 20px, 28px);
    margin: 0;
  }
}

.swiper-img {
  width: 283px;
  height: 100%;
  object-fit: cover;
  border-radius: var(--td-radius-large);
  box-shadow: 0 6px 10px 5px #0000000d, 0 12px 14px 2px #0000000a,
    0 8px 10px -5px #00000014;
}

:deep(.t-swiper-item) {
  .flex-center();
}

.tab-wrapper {
  .flex-center ();
  .font-templet();

  :deep(.t-tabs) {
    flex: 2;
  }

  background-color: white;

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
        .font-templet();
        margin-top: auto;
      }
    }
  }
}

.header {
  .flex-center();
  height: 26px;
}

.popup-title {
  .font-templet(600, 18px, 26px);
  flex: 1;
  text-align: center;
}
</style>
