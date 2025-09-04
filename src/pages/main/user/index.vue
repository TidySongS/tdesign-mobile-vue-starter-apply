<script setup lang="ts">
import type { UserProfile } from '@/api/info'
import { getPersonActivities } from '@/api/activity'
import { getUserProfile } from '@/api/info'
import { formatDate } from '@/utils/dateTime'
import ActivityCard from '../components/ActivityCard.vue'
import ActivityCardSkeleton from '../components/ActivityCardSkeleton.vue'

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
      cover: it.cover,
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
          <t-avatar v-if="!isProfileLoading" :image="profile?.avatar || 'https://tdesign.gtimg.com/mobile/demos/avatar1.png'" alt="用户头像" size="large" />
        </div>
        <div class="user-card-meta">
          <t-skeleton
            :loading="isProfileLoading && !profile" animation="flashed"
            style="--td-skeleton-row-spacing: 8px"
            :row-col="[{ height: '24px', width: '48px' }, [{ height: '24px', width: '43px' }, { height: '24px', width: '106px', marginLeft: '8px' }]]"
          />
          <div v-if="profile">
            <div class="user-name">
              {{ profile.name }}
            </div>
            <div class="user-tag">
              <t-tag variant="light">
                {{ profile.age }}岁
              </t-tag>
              <t-tag variant="light">
                {{ profile.occupation }}
              </t-tag>
            </div>
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
        <ActivityCardSkeleton v-if="isFetching && activities.length === 0" :count="1">
          <t-skeleton
            animation="flashed"
            :loading="true"
            style="margin-bottom: 4px"
            :row-col="[{ height: '22px', width: '100%' }]"
          />
          <t-skeleton
            animation="flashed"
            :loading="true"
            :row-col="[{ height: '20px', width: '90px' }]"
          />
          <t-skeleton
            animation="flashed"
            :loading="true"
            :row-col="[{ height: '22px', width: '42px' }]"
            style="margin-top: auto;"
          />
        </ActivityCardSkeleton>
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
@import './index.less';
</style>
