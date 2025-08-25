<script setup lang="ts">
import type { UserProfile } from '@/api/info'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { IconFont } from 'tdesign-icons-vue-next'
import { onMounted, ref } from 'vue'
import { getPersonActivities } from '@/api/activity'
import { getUserProfile } from '@/api/info'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Shanghai')

type TabValue = 'first' | 'second' | 'third'

type ActivityStatus = '待参加' | '已完成'

interface PersonActivity {
  id: string
  personId: string
  title: string
  status: ActivityStatus
  date: string | number | Date
  cover?: string
}

interface PersonActivitiesResponse {
  data: PersonActivity[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

interface ActivityItem {
  id: string
  cover: string
  title: string
  time: string
  status: ActivityStatus
}

const tabValue = ref<TabValue>('first')
const activities = ref<ActivityItem[]>([])
const isFetching = ref(false)
const profile = ref<UserProfile | null>(null)
const isProfileLoading = ref(false)

function onEdit(): void {
  // TODO: 跳转到个人信息编辑
}
function onReview(_id: string): void {
  // TODO: 跳转到评价
}

function formatDate(input: string | number | Date): string {
  return dayjs.tz(input, 'Asia/Shanghai').format('YYYY年M月D日')
}
function mapTabToStatus(tab: TabValue): ActivityStatus | undefined {
  if (tab === 'first')
    return '待参加'
  if (tab === 'second')
    return '已完成'
  return undefined
}

async function fetchActivities() {
  isFetching.value = true
  try {
    const status = mapTabToStatus(tabValue.value)
    const res = await getPersonActivities({ page: 1, pageSize: 20, status }) as unknown as PersonActivitiesResponse
    const pageData = Array.isArray(res.data) ? res.data : []
    activities.value = pageData.map(it => ({
      id: String(it.id),
      cover: it.cover ?? '/imgs/activity/cover-1.png',
      title: it.title,
      time: formatDate(it.date),
      status: it.status,
    }))
  }
  finally {
    isFetching.value = false
  }
}

async function fetchProfile() {
  isProfileLoading.value = true
  try {
    const res = await getUserProfile() as unknown as UserProfile
    profile.value = res
  }
  finally {
    isProfileLoading.value = false
  }
}

function onTabChange(value: string | number, _label: string) {
  tabValue.value = String(value) as TabValue
  fetchActivities()
}

onMounted(() => {
  fetchActivities()
  fetchProfile()
})
</script>

<template>
  <div class="user-page">
    <div class="user-card">
      <div class="user-card-info">
        <div class="user-card-avatar">
          <t-skeleton :loading="isProfileLoading && !profile" animation="flashed" :row-col="[{ height: '64px', width: '64px', type: 'circle' }]" />
          <t-avatar v-if="profile" :image="profile.avatar" alt="用户头像" size="large" />
        </div>
        <div class="user-card-meta">
          <div class="user-name">
            <t-skeleton :loading="isProfileLoading && !profile" animation="flashed" :row-col="[{ height: '24px', width: '120px' }]" />
            <template v-if="profile">
              {{ profile.name }}
            </template>
          </div>
          <div class="user-tag">
            <t-skeleton :loading="isProfileLoading && !profile" animation="flashed" :row-col="[{ height: '20px', width: '60px' }, { height: '20px', width: '120px' }]" />
            <template v-if="profile">
              <t-tag variant="light">
                {{ profile.age }}岁
              </t-tag>
              <t-tag variant="light">
                {{ profile.occupation }}
              </t-tag>
            </template>
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
        <t-tabs :value="tabValue" @change="onTabChange">
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
        <t-skeleton
          v-if="isFetching && activities.length === 0"
          :loading="true"
          animation="flashed"
          :row-col="[{ size: '120px' }]"
        />
        <t-empty v-if="!isFetching && activities.length === 0" description="暂无活动" />
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
                {{ item.status }}
              </div>
              <button
                v-if="item.status === '已完成'"
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
