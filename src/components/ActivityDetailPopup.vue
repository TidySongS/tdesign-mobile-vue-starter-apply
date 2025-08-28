<script setup lang="ts">
import type { ActivityDetail } from '@/api/activity'
import { IconFont } from 'tdesign-icons-vue-next'
import { formatDate } from '@/utils/dateTime'

const props = defineProps<{
  detail: ActivityDetail | null
  showBottomPopup: boolean
  popupHeight: string
}>()

const emit = defineEmits<{ (e: 'toggle'): void }>()

function onToggle() {
  emit('toggle')
}

const avatarList = computed<string[]>(() => (props.detail?.interestedPeople ?? []).map((p: any) => p.avatar).slice(0, 10))
const interestedCount = computed<number>(() => props.detail?.interestedCount ?? 0)
const title = computed<string>(() => props.detail?.title ?? '')
const address = computed<string>(() => props.detail?.address ?? '')
const introduce = computed<string>(() => props.detail?.introduce ?? '')
const dateText = computed<string>(() => {
  const d = props.detail?.date
  return formatDate(d as string | number | Date)
})

const star = computed(() => props.detail?.score ?? 0)
</script>

<template>
  <t-popup
    :visible="true"
    placement="bottom"
    :show-overlay="false"
    class="ad-popup-wrapper"
    :style="{ height: popupHeight }"
  >
    <div class="ad-popup">
      <div v-show="!showBottomPopup" class="ad-popup-handle" @click="onToggle" />
      <div class="ad-popup-toggle" :class="{ 'ad-popup-toggle-active': showBottomPopup }" @click="onToggle">
        <ChevronUpIcon size="20px" />
      </div>
      <div v-show="showBottomPopup" class="ad-popup-content">
        <template v-if="detail">
          <div class="ad-summary">
            <div class="ad-title">
              {{ title }}
            </div>
            <div class="ad-avatars">
              <t-avatar-group cascading="right-up" :max="5" size="36px" shape="circle">
                <t-avatar v-for="(url, index) in avatarList" :key="index" :image="url" />
              </t-avatar-group>
              <div class="ad-interest">
                {{ interestedCount }}人感兴趣
              </div>
            </div>
          </div>
          <div class="ad-meta">
            <div class="ad-time">
              <div class="ad-meta-item">
                <div class="ad-meta-icon">
                  <IconFont name="time" size="20px" class="ad-meta-icon-time" aria-hidden="true" />
                </div>
                <div class="ad-meta-text">
                  时间：{{ dateText }}
                </div>
              </div>
            </div>
            <div class="ad-location">
              <div class="ad-meta-item">
                <div class="ad-meta-icon">
                  <IconFont name="location" size="20px" class="ad-meta-icon-location" aria-hidden="true" />
                </div>
                <div class="ad-meta-text">
                  地点：{{ address }}
                </div>
              </div>
              <div class="ad-meta-item">
                <t-button size="extra-small" theme="light">
                  导航
                </t-button>
              </div>
            </div>
          </div>
          <div v-if="detail?.comments?.length" class="ad-reviews">
            <div class="ad-reviews-header">
              <div class="ad-reviews-title">
                活动评价({{ detail.comments.length }})
              </div>
              <div class="ad-reviews-rate">
                <t-rate :value="star" size="20" variant="filled" allow-half show-text disabled />
              </div>
            </div>
            <div class="ad-reviews-list">
              <t-swiper :autoplay="false" class="ad-reviews-swiper">
                <t-swiper-item v-for="c in (detail?.comments ?? [])" :key="c.id" class="ad-reviews-swiper-item">
                  <t-cell :title="c.user" class="ad-review-item">
                    <template #leftIcon>
                      <t-avatar shape="circle" :image="c.avatar" />
                    </template>
                    <template #description>
                      <div class="ad-review-item-content">
                        {{ c.content }}
                      </div>
                    </template>
                  </t-cell>
                </t-swiper-item>
              </t-swiper>
            </div>
          </div>
          <div class="ad-intro">
            <div class="ad-intro-title">
              活动介绍
            </div>
            <div class="ad-intro-content">
              {{ introduce }}
            </div>
          </div>
        </template>
        <template v-else>
          <div>
            <t-skeleton :loading="true" animation="flashed" :row-col="[{ height: '28px', width: '60%' }]" />
            <div style="height: 12px" />
            <t-skeleton :loading="true" animation="flashed" :row-col="[{ height: '36px', width: '50%', type: 'circle' }, { height: '16px', width: '80px' }]" />
            <div style="height: 12px" />
            <t-skeleton :loading="true" animation="flashed" :row-col="[{ height: '20px', width: '100%' }, { height: '20px', width: '70%' }]" />
            <div style="height: 12px" />
            <t-skeleton :loading="true" animation="flashed" :row-col="[{ height: '92px', width: '100%' }]" />
            <div style="height: 12px" />
            <t-skeleton :loading="true" animation="flashed" :row-col="[{ height: '22px', width: '40%' }, { height: '60px', width: '100%' }]" />
          </div>
        </template>
      </div>
    </div>
  </t-popup>
</template>

<style lang="less" scoped>
.ad-popup {
  .flex-col();
  border-radius: 12px;
  background-color: #fff;
  position: relative;
  height: 100%;
  .ad-popup-content {
    .flex-col();
    padding: 24px 16px;
    padding-bottom: 80px;
    gap: 16px;
    overflow-y: auto;
    overflow-x: hidden;
    flex: 1;
    min-height: 0;
  }
  /* skeleton 样式使用组件默认样式与行列配置，这里无需额外样式 */
  .ad-popup-handle {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 76px;
    height: 11px;
    top: -10px;
    background: url('@/assets/half-circle.png') no-repeat center center;
    background-size: 100% 100%;
  }
  .ad-popup-toggle {
    .flex-center();
    height: 11px;
    width: 100%;
    position: absolute;
    z-index: 99;
    top: 0;
    .t-icon {
      color: var(--td-font-gray-2);
    }
  }
  .ad-popup-toggle-active {
    height: 44px;
    top: -32px;
    z-index: -1;
    background: url('/imgs/mask.png');
    padding-bottom: 12px;
    .t-icon {
      color: var(--td-font-white-1);
      transform: rotate(180deg);
    }
  }

  .ad-reviews {
    padding-bottom: 16px;
    border-bottom: 0.5px solid var(--td-gray-color-3);
    .ad-reviews-header {
      .flex-center(space-between);
      .ad-reviews-title {
        .font(16px, 600);
        height: 24px;
        color: #040000;
        text-align: left;
      }
      .ad-reviews-rate {
        --td-rate-text-active-color: var(--td-warning-color-5);
        --td-rate-disabled-selected-color: var(--td-warning-color-5);
        --td-rate-text-font-size: 14px;
      }
    }
  }
  .ad-intro {
    .ad-intro-title {
      .font(16px, 600);
      color: #040000;
      text-align: left;
    }
    .ad-intro-content {
      margin-top: 12px;
    }
  }
  .ad-popup-actions {
    display: flex;
    gap: 12px;
  }
}

.ad-summary {
  padding-bottom: 16px;
  border-bottom: 0.5px solid var(--td-gray-color-3);
  .ad-title {
    .font(20px, 600);
    color: #040000;
  }
  .ad-avatars {
    margin-top: 12px;
    display: flex;
    gap: 8px;
    align-items: center;
    --td-avatar-group-margin-left-medium: -12px;
    .ad-interest {
      font-size: 12px;
      line-height: 20px;
      color: var(--td-font-gray-2);
    }
    .t-avatar__wrapper:nth-child(1) {
      margin-left: 0;
    }
  }
}

.ad-meta {
  .flex-col();
  .font();
  padding-bottom: 16px;
  border-bottom: 0.5px solid var(--td-gray-color-3);
  gap: 8px;
  .ad-meta-text {
    margin-left: 4px;
    color: #040000;
  }
  .ad-time,
  .ad-location {
    .flex-center(space-between);
    .ad-meta-item {
      .flex-center();
      .ad-meta-icon-time,
      .ad-meta-icon-location {
        color: var(--td-brand-color-7);
      }
    }
  }
}

.ad-reviews-list {
  --td-cell-bg-color: var(--td-gray-color-1);
  --td-cell-vertical-padding: 12px;
  margin-top: 12px;
  --ad-swiper-width: 343px;
  .ad-reviews-swiper {
    overflow: visible;
    margin: 0 calc((100vw - var(--ad-swiper-width)) - 48px) 0 0;
    .ad-reviews-swiper-item {
      width: var(--ad-swiper-width);
      height: 90px;
    }
  }
  .ad-review-item {
    height: 90px;
    border-radius: 9px;
    :deep(.t-cell__left) {
      .flex-center();
    }
    :deep(.t-cell__title-text) {
      font-size: 14px;
    }
    .ad-review-item-content {
      .font(12px, 400);
      color: var(--td-font-gray-2);
      text-align: left;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      line-clamp: 2;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
