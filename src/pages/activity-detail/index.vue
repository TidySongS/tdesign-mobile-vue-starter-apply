<script setup lang="ts">
import { IconFont } from 'tdesign-icons-vue-next'
import { ref, watch } from 'vue'

const swiperList = [
  '/public/imgs/guests1.png',
  '/public/imgs/guests2.png',
  '/public/imgs/guests3.png',
]

const swiperList2 = [
  '/public/imgs/location1.png',
  '/public/imgs/location2.png',
]

const showBottomPopup = ref(true)
const popupHeight = ref('91px')

/*
  收起Popup
*/
function closeBottomPopup() {
  showBottomPopup.value = false
}

/*
  展开Popup
*/
function expandPopup() {
  showBottomPopup.value = true
}

/*
  控制Popup的展开和收起
*/
function controlPopup() {
  if (showBottomPopup.value) {
    closeBottomPopup()
  }
  else {
    expandPopup()
  }
}

const imageList = ref([
  '/public/imgs/avatar1.png',
  '/public/imgs/avatar2.png',
  '/public/imgs/avatar3.png',
  '/public/imgs/avatar4.png',
  '/public/imgs/avatar5.png',
  '/public/imgs/avatar1.png',
  '/public/imgs/avatar2.png',
  '/public/imgs/avatar3.png',
  '/public/imgs/avatar4.png',
  '/public/imgs/avatar5.png',
])
const avatarUrl = '/public/imgs/avatar1.png'

// 评分
const star = ref(4.5)

/*
 控制Popup的高度，展开为80vh高，关闭为91px高
*/
watch(
  showBottomPopup,
  (isOpen) => {
    popupHeight.value = isOpen ? '80vh' : '91px'
  },
  { immediate: true },
)
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
  <main>
    <div class="ad-banner">
      <img
        src="/public/imgs/activity-banner.png"
        alt="活动横幅"
        loading="lazy"
      >
    </div>
    <div class="ad-section-guests">
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
            v-for="(item, index) in swiperList"
            :key="index"
            class="ad-slide"
          >
            <img :src="item" :alt="`活动嘉宾图片${index + 1}`" loading="lazy">
          </t-swiper-item>
        </t-swiper>
      </div>
    </div>
    <div class="ad-section-scene">
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
            v-for="(item, index) in swiperList2"
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
      <t-button size="large" theme="primary" block>
        立即购买 ¥88-¥228
      </t-button>
    </div>
  </footer>
  <t-popup
    :visible="true"
    placement="bottom"
    :show-overlay="false"
    class="ad-popup-wrapper"
    :class="{ 'is-open': showBottomPopup, 'is-closed': !showBottomPopup }"
  >
    <div class="ad-popup">
      <div
        v-show="!showBottomPopup"
        class="ad-popup-handle"
        @click="controlPopup"
      />
      <div
        class="ad-popup-toggle"
        :class="{ 'ad-popup-toggle-active': showBottomPopup }"
        @click="controlPopup"
      >
        <IconFont name="chevron-up" size="18px" aria-hidden="true" />
      </div>
      <div v-show="showBottomPopup" class="ad-popup-content">
        <div class="ad-summary">
          <div class="ad-title">
            2021 SICC服务设计创新大会
          </div>
          <div class="ad-avatars">
            <t-avatar-group
              cascading="right-up"
              :max="5"
              size="36px"
              shape="circle"
            >
              <t-avatar
                v-for="(url, index) in imageList"
                :key="index"
                :image="url"
              />
            </t-avatar-group>
            <div class="ad-interest">
              263人感兴趣
            </div>
          </div>
        </div>
        <div class="ad-meta">
          <div class="ad-time">
            <div class="ad-meta-item">
              <div class="ad-meta-icon">
                <IconFont
                  name="time"
                  size="20px"
                  class="ad-meta-icon-time"
                  aria-hidden="true"
                />
              </div>
              <div class="ad-meta-text">
                时间：2021年3月16日
              </div>
            </div>
          </div>
          <div class="ad-location">
            <div class="ad-meta-item">
              <div class="ad-meta-icon">
                <IconFont
                  name="location"
                  size="20px"
                  class="ad-meta-icon-location"
                  aria-hidden="true"
                />
              </div>
              <div class="ad-meta-text">
                地点：深圳市腾讯滨海大厦
              </div>
            </div>
            <div class="ad-meta-item">
              <t-button size="extra-small" theme="light">
                导航
              </t-button>
            </div>
          </div>
        </div>
        <div class="ad-reviews">
          <div class="ad-reviews-header">
            <div class="ad-reviews-title">
              活动评价(26)
            </div>
            <div class="ad-reviews-rate">
              <t-rate
                v-model="star"
                size="20"
                variant="filled"
                allow-half
                show-text
                disabled
              />
            </div>
          </div>
          <div class="ad-reviews-list">
            <t-swiper
              :autoplay="false"
              :next-margin="20"
              class="ad-reviews-swiper"
            >
              <t-swiper-item class="ad-reviews-swiper-item">
                <t-cell title="小小轩" class="ad-review-item">
                  <template #leftIcon>
                    <t-avatar shape="circle" :image="avatarUrl" />
                  </template>
                  <template #description>
                    <div class="ad-review-item-content">
                      我已经是第三次参加SICC大会了，作为一名服务体验设计行业的从业者，每次参与都受益匪浅
                    </div>
                  </template>
                </t-cell>
              </t-swiper-item>
              <t-swiper-item class="ad-reviews-swiper-item">
                <t-cell title="小小轩" class="ad-review-item">
                  <template #leftIcon>
                    <t-avatar shape="circle" :image="avatarUrl" />
                  </template>
                  <template #description>
                    <div class="ad-review-item-content">
                      我已经是第三次参加SICC大会了，作为一名服务体验设计行业的从业者，每次参与都受益匪浅
                    </div>
                  </template>
                </t-cell>
              </t-swiper-item>
              <t-swiper-item class="ad-reviews-swiper-item">
                <t-cell title="小小轩" class="ad-review-item">
                  <template #leftIcon>
                    <t-avatar shape="circle" :image="avatarUrl" />
                  </template>
                  <template #description>
                    <div class="ad-review-item-content">
                      我已经是第三次参加SICC大会了，作为一名服务体验设计行业的从业者，每次参与都受益匪浅
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
            在数字化时代背景下，如何抓住机遇，构建“数字”+“文化”更高效、宽领域、深覆盖的新时代文化创新之路，让优秀传统文化得以延续和新生，被更多人认可和接受，也是我们服务设计探索的方向。2021年5月16日，由腾讯用户研究与体验设计部（简称CDC）主办的第三届服务创新大会，将在深圳腾讯滨海大厦召开。近年来数字化正在赋能传统文化的传承和传播，而传统文化也同样在启发新的服务设计理念和思路，两者之间的界限越来越模糊，相互融合。本次大会将围绕文化保育和文化创新，邀请7位传统文物、建筑、服饰、工艺等不同艺术领域的行业专家，为我们分享最新发展趋势和实践经验，开拓来宾在传统文化与数字科技间的碰撞思路，探索新的服务设计课题，让我们先睹为快，了解这些专家们将会分享哪些主题。
          </div>
        </div>
      </div>
    </div>
  </t-popup>
</template>

<style lang="less" scoped>
.ad-navbar {
  --td-navbar-bg-color: #040000;
  --td-navbar-color: var(--td-font-white-1);
}
main {
  padding-top: 48px;
  background-color: #040000;
  height: 100%;
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
.ad-popup {
  border-radius: 12px;
  background-color: #fff;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  .ad-popup-content {
    padding: 24px 16px;
    padding-bottom: 80px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    overflow-y: auto;
    overflow-x: hidden;
    flex: 1;
    min-height: 0;
  }
  .ad-popup-handle {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 76px;
    height: 11px;
    top: -10px;
    background: url("/public/imgs/half-circle.png") no-repeat center center;
    background-size: 100% 100%;
  }
  .ad-popup-toggle {
    width: 16px;
    height: 16px;
    position: absolute;
    left: 50%;
    top: 0;
    transform: translateX(-50%);

    i {
      position: absolute;
    }
  }
  .ad-popup-toggle-active {
    top: -24px;
    box-shadow: var(--td-shadow-2);

    i {
      color: var(--td-font-white-1);
      transform: rotate(180deg);
    }
  }
  .ad-summary {
    padding-bottom: 16px;
    border-bottom: 0.5px solid var(--td-gray-color-3);
    .ad-title {
      font-size: 20px;
      line-height: 28px;
      font-weight: 600;
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
    font-size: 14px;
    padding-bottom: 16px;
    border-bottom: 0.5px solid var(--td-gray-color-3);
    display: flex;
    flex-direction: column;
    gap: 8px;
    .ad-meta-text {
      margin-left: 4px;
      line-height: 22px;
      color: #040000;
    }
    .ad-time,
    .ad-location {
      display: flex;
      justify-content: space-between;
      .ad-meta-item {
        display: flex;
        align-items: center;
        .ad-meta-icon-time,
        .ad-meta-icon-location {
          color: var(--td-brand-color-7);
        }
      }
    }
  }
  .ad-reviews {
    padding-bottom: 16px;
    border-bottom: 0.5px solid var(--td-gray-color-3);
    .ad-reviews-header {
      display: flex;
      justify-content: space-between;
      .ad-reviews-title {
        height: 24px;
        color: #040000;
        font-size: 16px;
        font-weight: 600;
        text-align: left;
        line-height: 24px;
      }
      .ad-reviews-rate {
        --td-rate-text-active-color: var(--td-warning-color-5);
        --td-rate-disabled-selected-color: var(--td-warning-color-5);
        --td-rate-text-font-size: 14px;
      }
    }
    .ad-reviews-list {
      --td-cell-bg-color: var(--td-gray-color-1);
      --td-cell-vertical-padding: 12px;
      margin-top: 12px;
      --swiper-width: 343px;
      .ad-reviews-swiper {
        overflow: visible;
        margin: 0 calc((100vw - var(--swiper-width)) - 48px) 0 0;
        .ad-reviews-swiper-item {
          width: var(--swiper-width);
          height: 100px;
        }
      }
      .ad-review-item {
        border-radius: 9px;
        .ad-review-item-content {
          color: #00000099;
          font-size: 12px;
          font-weight: 400;
          text-align: left;
          line-height: 20px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          line-clamp: 2;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
  .ad-intro {
    .ad-intro-title {
      color: #040000;
      font-size: 16px;
      font-weight: 600;
      text-align: left;
      line-height: 24px;
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
:global(.ad-popup-wrapper) {
  height: v-bind(popupHeight);
}
:global(.ad-popup-wrapper.is-open) {
  height: 80vh;
}
:global(.ad-popup-wrapper.is-closed) {
  height: 91px;
}
</style>
