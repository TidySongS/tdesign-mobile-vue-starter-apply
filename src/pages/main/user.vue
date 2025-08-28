<script setup lang="ts">
import type { UserProfile } from '@/api/info'
import { getPersonActivities } from '@/api/activity'
import { getUserProfile } from '@/api/info'
import { formatDate } from '@/utils/dateTime'

type TabValue = 'first' | 'second' | 'third'

type ActivityStatus = '待参加' | '已完成'

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
    const res = await getPersonActivities({ page: 1, pageSize: 20, status })
    const pageData = Array.isArray(res.data) ? res.data : []
    activities.value = pageData.map(it => ({
      id: String(it.id),
      cover: it.cover ?? '/imgs/activity/cover1.png',
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
    const res = await getUserProfile()
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
        <EditIcon size="20px" />
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
          <ActivityCard :cover="item.cover" :title="item.title">
            <template #content>
              <div class="activity-item-time">
                {{ item.time }}
              </div>
            </template>
            <template #footer>
              <div class="activity-item-bottom">
                <div
                  class="activity-item-status"
                  :style="{ color: item.status === '已完成' ? 'var(--td-font-gray-3)' : 'var(--td-success-color-5)' }"
                >
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
            </template>
          </ActivityCard>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.user-page {
  .flex-col();
  background: var(--bg-color-secondarypage);
  height: calc(100vh - var(--navbar-height) - var(--tabbar-height));
  padding: 0 var(--td-spacer-2);
  .user-card {
    .p-16();
    .flex-center(space-between);
    background: var(--bg-color-page);
    border-radius: var(--td-radius-extraLarge);
    .user-card-edit {
      .flex-center();
      background: none;
      border: 0;
      padding: 0;
      cursor: pointer;
    }
  }
}

@supports (height: 100dvh) {
  // 移动端适配
  .user-page {
    height: calc(100dvh - var(--navbar-height) - var(--tabbar-height));
  }
}

.user-card-info {
  .flex-center();
  gap: var(--td-spacer-2);
  .user-card-avatar {
    width: 64px;
  }
  .user-card-meta {
    .flex-col();
    height: 54px;
    max-width: calc(100vw - 180px);
    justify-content: space-between;
    .user-name {
      .font(16px, 600);
      height: 24px;
      color: var(--td-font-gray-1);
    }
    .user-tag {
      min-width: 0;
      display: flex;
      gap: var(--td-spacer);
    }
    .user-tag .t-tag:nth-child(2) {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

.activity-list {
  .flex-col();
  margin-top: var(--td-spacer-2);
  background: var(--bg-color-page);
  border-top-left-radius: var(--td-radius-extraLarge);
  border-top-right-radius: var(--td-radius-extraLarge);
  overflow: hidden;
  flex: 1;
  min-height: 0;
  .activity-content {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
    padding-bottom: calc(var(--td-spacer-2) + constant(safe-area-inset-bottom));
    padding-bottom: calc(var(--td-spacer-2) + env(safe-area-inset-bottom));
  }
}

.activity-item {
  .activity-item-time {
    .font(12px, 400);
    margin-top: 4px;
    color: var(--td-font-gray-2);
  }
}
.activity-item-bottom {
  .flex-center(space-between);
  .activity-item-status {
    display: flex;
  }
  .activity-item-btn {
    .font(14px, 400);
    color: var(--td-brand-color-7);
    background: none;
    border: 0;
    padding: 0;
    cursor: pointer;
  }
}
</style>
