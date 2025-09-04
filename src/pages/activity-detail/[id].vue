<script setup lang="ts">
import type { ActivityDetail } from '@/api/activity'
import {
  getActivityDetail,
} from '@/api/activity'
import { isExpired } from '@/utils/dateTime'
import Popup from './components/Popup.vue'

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
    detail.value?.banner || detail.value?.cover,
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

// 判断活动是否已结束
const isEnded = computed<boolean>(() => {
  if (!detail.value || !detail.value.date)
    return false
  return isExpired(detail.value.date)
})

async function fetchData() {
  try {
    const d = await getActivityDetail(activityId.value)
    if (!d || !d.id || String(d.id) !== activityId.value) {
      throw new Error('Invalid activity detail')
    }
    detail.value = d
  }
  catch {
    router.push('/not-found')
  }
}

onMounted(() => {
  fetchData()
})

function handleBuyClick() {
  if (isEnded.value)
    return
  router.push(`/buy-confirm/${activityId.value}`)
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
      <t-skeleton
        v-if="!detail"
        :loading="true"
        :row-col="[{ width: '100%', height: '160px' }]"
      />
      <t-image
        v-else
        :src="bannerUrl" alt="活动横幅" loading="lazy" fit="cover"
        :style="{ width: '100%', height: '160px' }"
        class="banner-image"
      />
    </div>
    <div v-if="guestImages.length" class="ad-section-guests">
      <div class="ad-section-title">
        活动嘉宾
      </div>
      <div class="ad-swiper">
        <t-swiper
          :autoplay="false"
          :navigation="{ type: 'dots', placement: 'outside' }"
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
        <HeartIcon size="20px" />
        <div class="ad-footer-action-text">
          收藏
        </div>
      </div>
      <div class="ad-footer-action">
        <ShareIcon size="20px" />
        <div class="ad-footer-action-text">
          分享
        </div>
      </div>
    </div>
    <div class="ad-footer-cta">
      <t-button v-if="!isEnded" size="large" theme="primary" block @click="handleBuyClick">
        {{ `立即购买 ${priceText}` }}
      </t-button>
      <t-button v-else size="large" theme="primary" block disabled>
        已下架
      </t-button>
    </div>
  </footer>
  <Popup
    :detail="detail"
    :show-bottom-popup="showBottomPopup"
    :popup-height="popupHeight"
    @toggle="controlPopup"
  />
</template>

<style lang="less" scoped>
@import './index.less';
</style>
