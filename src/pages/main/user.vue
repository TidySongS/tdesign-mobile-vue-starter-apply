<script setup lang="ts">
import { IconFont } from 'tdesign-icons-vue-next'
import { ref } from 'vue'

function onEdit(): void {
  console.log('Todo...')
}
function onReview(_id: number): void {
  console.log('Todo...')
}

interface ActivityItem {
  id: number
  cover: string
  title: string
  time: string
  status: 'pendding' | 'done'
}

const activities = ref<ActivityItem[]>([
  {
    id: 1,
    cover: '/imgs/activity/cover-2.png',
    title: '2021 SICC服务设计创...',
    time: '2021年3月16日',
    status: 'pendding',
  },
  {
    id: 2,
    cover: '/imgs/activity/cover-3.png',
    title: 'SICC 2019 创新论坛',
    time: '2019年5月20日',
    status: 'done',
  },
])
</script>

<template>
  <div class="user-page">
    <div class="user-card">
      <div class="user-card-info">
        <div class="user-card-avatar">
          <t-avatar image="/imgs/avatar1.png" alt="用户头像" size="large" />
        </div>
        <div class="user-card-meta">
          <div class="user-name">
            蔡宣轩
          </div>
          <div class="user-tag">
            <t-tag variant="light">
              29岁
            </t-tag>
            <t-tag variant="light">
              设计/艺术从业者
            </t-tag>
          </div>
        </div>
      </div>
      <button
        class="user-card-edit"
        type="button"
        aria-label="编辑个人信息"
        @click="onEdit"
      >
        <IconFont name="edit" size="20px" aria-hidden="true" />
      </button>
    </div>
    <div class="activity-list">
      <div class="tab-wrapper">
        <t-tabs default-value="first">
          <t-tab-panel
            value="first"
            :badge-props="{ dot: true, offset: [-4, 1] }"
            label="待参加"
          />
          <t-tab-panel value="second" label="已完成" />
          <t-tab-panel value="third" label="全部活动" />
        </t-tabs>
      </div>
      <div class="activity-content">
        <div v-for="item in activities" :key="item.id" class="activity-item">
          <div class="activity-item-img">
            <img :src="item.cover" :alt="item.title" loading="lazy">
          </div>
          <div class="activity-item-info">
            <div class="activity-item-top">
              <div class="activity-item-title">
                {{ item.title }}
              </div>
              <div class="activity-item-time">
                {{ item.time }}
              </div>
            </div>
            <div class="activity-item-bottom">
              <div class="activity-item-status">
                {{ item.status === "pendding" ? "待参加" : "已完成" }}
              </div>
              <button
                v-show="item.status === 'done'"
                class="activity-item-btn"
                type="button"
                aria-label="去评价"
                @click="onReview(item.id)"
              >
                去评价
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.user-page {
  background-color: var(--bg-color-secondarypage);
  height: calc(100vh - var(--navbar-height) - var(--tabbar-height));
  padding: 0 var(--td-spacer-2);
  display: flex;
  flex-direction: column;
  .user-card {
    padding: var(--td-spacer-2);
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: var(--td-radius-extraLarge);
    .user-card-info {
      display: flex;
      align-items: center;
      gap: var(--td-spacer-2);
      .user-card-avatar {
        width: 64px;
      }
      .user-card-meta {
        display: flex;
        flex-direction: column;
        height: 54px;
        justify-content: space-between;
        .user-name {
          height: 24px;
          color: var(--td-font-gray-1);
          font-size: var(--td-font-size-body-large);
          font-weight: 600;
          line-height: 24px;
        }
        .user-tag {
          display: flex;
          gap: var(--td-spacer);
        }
      }
    }
    .user-card-edit {
      background: none;
      border: 0;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
  }
  .activity-list {
    margin-top: var(--td-spacer-2);
    background: white;
    border-top-left-radius: var(--td-radius-extraLarge);
    border-top-right-radius: var(--td-radius-extraLarge);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    .activity-content {
      padding: var(--td-spacer-2);
      display: flex;
      flex-direction: column;
      gap: var(--td-spacer-2);
      flex: 1;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      overscroll-behavior: contain;
      .activity-item {
        flex-shrink: 0;
        height: 120px;
        min-height: 120px;
        border-radius: var(--td-radius-large);
        display: flex;
        overflow: hidden;
        box-shadow: var(--td-shadow-3);
        .activity-item-img {
          height: 100%;
          img {
            height: 100%;
            aspect-ratio: 1/1;
          }
        }
        .activity-item-info {
          padding: var(--td-spacer-2) var(--td-spacer-2) var(--td-spacer-1)
            var(--td-spacer-2);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex: 1;
          .activity-item-top {
            display: flex;
            flex-direction: column;
            gap: 4px;
            .activity-item-title {
              color: var(--td-font-gray-1);
            }
            .activity-item-time {
              color: var(--td-font-gray-2);
              font-size: var(--td-font-size-body-small);
              line-height: 20px;
            }
          }
          .activity-item-bottom {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .activity-item-status {
              display: flex;
              color: var(--td-success-color-5);
              font-weight: 600;
            }
            .activity-item-btn {
              color: var(--td-brand-color-7);
              background: none;
              border: 0;
              padding: 0;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
}
</style>
