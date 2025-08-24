<script setup lang="ts">
import type { ActivityDetail } from '@/api/activity'
import { IconFont } from 'tdesign-icons-vue-next'
import { computed, onMounted, ref, watch } from 'vue'
import {
  getActivityDetail,
} from '@/api/activity'
import ActivityDetailPopup from '@/components/ActivityDetailPopup.vue'

const route = useRoute()
const router = useRouter()
const activityId = computed(() => String((route.params as { id: string }).id))

// 详情数据
const detail = ref<ActivityDetail | null>(null)

// 展示交互
const showBottomPopup = ref(true)
const popupHeight = ref('91px')

function closeBottomPopup() {
  showBottomPopup.value = false
}

function expandPopup() {
  showBottomPopup.value = true
}

function controlPopup() {
  if (showBottomPopup.value) {
    closeBottomPopup()
  }
  else {
    expandPopup()
  }
}

watch(
  showBottomPopup,
  (isOpen) => {
    popupHeight.value = isOpen ? '80vh' : '91px'
  },
  { immediate: true },
)

const bannerUrl = computed(
  () =>
    detail.value?.banner || detail.value?.cover || '/imgs/activity-banner.png',
)
const guestImages = computed<string[]>(() => detail.value?.guestImages ?? [])
const sceneImages = computed<string[]>(() => detail.value?.sceneImages ?? [])
const priceText = computed<string>(() => {
  if (!detail.value)
    return ''
  const min = detail.value.minPrice ?? 0
  const max = detail.value.maxPrice ?? 0
  if (min === 0 && max === 0)
    return '免费'
  if (min === max)
    return `¥${min}`
  return `¥${min}-¥${max}`
})

async function fetchData() {
  const d = await getActivityDetail(activityId.value)
  detail.value = d
}

onMounted(() => {
  fetchData()
})

function handleBuyClick() {
  router.push(`/buy-confirm?eventId=${activityId.value}`)
}
</script>

<template>
  <header>
    <t-navbar
      title="详情"
      left-arrow
      :on-left-click="$router.back"
      class="ad-navbar"
    />
  </header>
  <main class="ad-main">
    <div class="ad-banner">
      <img :src="bannerUrl" alt="活动横幅" loading="lazy">
    </div>
    <div v-if="guestImages.length" class="ad-section-guests">
      <div class="ad-section-title">
        活动嘉宾
      </div>
      <div class="ad-swiper">
        <t-swiper
          :autoplay="false"
          :navigation="{ type: 'dots', placement: 'outside' }"
          :next-margin="20"
          class="ad-swiper-scene"
        >
          <t-swiper-item
            v-for="(item, index) in guestImages"
            :key="index"
            class="ad-slide"
          >
            <img :src="item" :alt="`活动嘉宾图片${index + 1}`" loading="lazy">
          </t-swiper-item>
        </t-swiper>
      </div>
    </div>
    <div v-if="sceneImages.length" class="ad-section-scene">
      <div class="ad-section-title">
        活动现场
      </div>
      <div class="ad-swiper">
        <t-swiper
          :autoplay="false"
          :navigation="{ type: 'dots', placement: 'outside' }"
          :next-margin="20"
          class="ad-swiper-scene"
        >
          <t-swiper-item
            v-for="(item, index) in sceneImages"
            :key="index"
            class="ad-slide"
          >
            <img :src="item" :alt="`活动现场图片${index + 1}`" loading="lazy">
          </t-swiper-item>
        </t-swiper>
      </div>
    </div>
  </main>
  <footer>
    <div class="ad-footer-actions">
      <div class="ad-footer-action">
        <IconFont name="heart" size="16px" aria-hidden="true" />
        <div class="ad-footer-action-text">
          收藏
        </div>
      </div>
      <div class="ad-footer-action">
        <IconFont name="share" size="16px" aria-hidden="true" />
        <div class="ad-footer-action-text">
          分享
        </div>
      </div>
    </div>
    <div class="ad-footer-cta">
      <t-button size="large" theme="primary" block @click="handleBuyClick">
        立即购买 {{ priceText }}
      </t-button>
    </div>
  </footer>
  <ActivityDetailPopup
    :detail="detail"
    :show-bottom-popup="showBottomPopup"
    :popup-height="popupHeight"
    @toggle="controlPopup"
  />
</template>

<style lang="less" scoped>
.ad-navbar {
  --td-navbar-bg-color: #040000;
  --td-navbar-color: var(--td-font-white-1);
}
.ad-main {
  padding-top: 48px;
  background-color: #040000;
  height: calc(100vh - v-bind(popupHeight));
  padding-bottom: calc(80px + env(safe-area-inset-bottom));
}
.ad-banner {
  img {
    width: 100%;
  }
}
.ad-section-guests,
.ad-section-scene {
  color: var(--td-font-white-1);
  font-size: var(--td-font-size-mark-large);
  padding-left: 16px;
  --swiper-width: 283px;
  .ad-section-title {
    font-size: 16px;
    font-weight: 600;
    text-align: left;
    line-height: 24px;
  }
  .ad-swiper {
    margin-top: 12px;
    .ad-swiper-scene {
      overflow: visible;
      margin: 0 calc((100vw - var(--swiper-width)) - 32px) 0 0;
      .ad-slide {
        width: var(--swiper-width);
        height: 160px;
      }
    }
  }
}
.ad-section-guests {
  margin-top: 21px;
}
.ad-section-scene {
  margin-top: 24px;
}
footer {
  z-index: 12000;
  height: 80px;
  background-color: var(--td-font-white-1);
  position: fixed;
  bottom: 0px;
  width: 100%;
  padding: 16px;
  display: flex;
  box-sizing: border-box;
  gap: 16px;
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
  .ad-footer-actions {
    display: flex;
    align-items: center;

    .ad-footer-action {
      width: 50px;
      height: 48px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .ad-footer-action-text {
        height: 20px;
        color: #040000;
        font-size: 12px;
        font-weight: 400;
        text-align: center;
        line-height: 20px;
      }
    }
  }
  .ad-footer-cta {
    flex: 1;
  }
}
</style>
