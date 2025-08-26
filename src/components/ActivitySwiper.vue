<script setup lang="ts">
interface SwiperItem {
  id: string
  name: string
  url: string
}

const props = withDefaults(
  defineProps<{
    swiperList: SwiperItem[]
    isFetchSwiperList?: boolean
    sideType?: 'both' | 'right' | 'left'
    swiperGap?: number
    swiperReady?: boolean
  }>(),
  {
    isFetchSwiperList: false,
    sideType: 'both',
    swiperGap: 12,
    swiperReady: true,
  },
)

const swiperStyle = computed(() => {
  const sideSpace = `calc(100vw - var(--swiper-width))`
  if (props.sideType === 'right') {
    return {
      margin: `0 0 0 calc(${sideSpace} - ${props.swiperGap}px)`,
    }
  }
  else if (props.sideType === 'left') {
    return {
      margin: `0 calc(${sideSpace} - ${props.swiperGap}px * 2) 0 ${props.swiperGap}px`,
    }
  }
  else {
    return {
      margin: `0 calc(${sideSpace} / 2 - ${props.swiperGap}px) 0 calc(${sideSpace} / 2)`,
    }
  }
})
</script>

<template>
  <div class="swiper-container">
    <div v-show="!swiperReady || props.swiperList.length === 0">
      <div class="swiper-placeholder">
        <div
          v-show="sideType !== 'right'"
          class="swiper-placeholder__side swiper-img"
          style="border-radius: 0 9px 9px 0"
        />
        <div class="swiper-placeholder__main swiper-img">
          <span v-show="!isFetchSwiperList && props.swiperList.length === 0">暂无轮播图数据</span>
        </div>
        <div
          v-show="sideType !== 'left'"
          class="swiper-placeholder__side swiper-img"
          style="border-radius: 9px 0 0 9px"
        />
      </div>
      <div class="dots-placeholder">
        <t-loading
          v-if="isFetchSwiperList"
          :pause="!isFetchSwiperList"
          theme="dots"
          :duration="5000"
          size="30px"
        />
      </div>
    </div>
    <div
      v-if="swiperReady && props.swiperList.length > 0"
    >
      <t-swiper
        :height="159.2"
        :autoplay="true"
        :navigation="{ type: 'dots', placement: 'outside' }"
        class="swiper"
        :style="swiperStyle"
      >
        <t-swiper-item v-for="item in props.swiperList" :key="item.id">
          <t-image :src="item.url" :alt="item.name" fit="cover" />
        </t-swiper-item>
      </t-swiper>
    </div>
  </div>
</template>

<style scoped lang="less">
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
  .flex-center();
  flex-grow: 1;
  height: var(--swiper-height);
  &__main {
    .flex-center();
    width: var(--swiper-width);
    margin: 0 12px;
  }
  .swiper-img {
    height: 100%;
    border-radius: var(--td-radius-large);
    background-color: var(--td-gray-color-1);
  }
  &__side {
    flex-grow: 1;
  }
}

.swiper {
  overflow: visible;
  .t-image {
    width: var(--swiper-width);
    height: 100%;
    box-shadow: var(--td-shadow-3);
  }
}
</style>
