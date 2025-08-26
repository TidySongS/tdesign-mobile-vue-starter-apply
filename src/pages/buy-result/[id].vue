<script setup lang="ts">
import type { AppItem, Person } from '@/types/interface'
import { Message } from 'tdesign-mobile-vue'

import { getActivityDetail } from '@/api/activity'
import { getAppList, getFriendList } from '@/api/share'

const route = useRoute()
const router = useRouter()

function share() {
  return h(ShareIcon, {
    size: '22px',
  })
}

// 控制分享弹窗的显示/隐藏
const isSharePopupVisible = ref(false)

// 活动ID
const activityId = computed(() => (route.params as {
  id: string
}).id)
// 活动信息
const activity = ref({
  name: '',
  date: '',
  address: '',
  cover: '',
})
// 选中的人员
const selectedPerson = ref({
  name: '蔡宣轩',
  age: '29岁',
  occupation: '设计师/艺术从业者',
})

const frendList = reactive<Person[]>([])
const appList = reactive<AppItem[]>([])
// 加载状态
const loading = ref(true)

// 获取活动信息
async function fetchActivityData() {
  try {
    // 获取活动详情
    const data = await getActivityDetail(activityId.value)

    // 处理日期
    const date = new Date(data.date)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    // 设置活动信息
    activity.value = {
      name: data.title,
      date: `${year}年${month}月${day}日`,
      address: data.address,
      cover: data.cover,
    }

    loading.value = false
  }
  catch (err) {
    console.error('Error fetching activity data:', err)
    loading.value = false
    // 找不到活动信息时跳转到404页面
    router.push('/not-found')
  }
}

// 获取朋友\app信息
async function fetchFrendandAppdata() {
  try {
    const flresponse = await getFriendList()
    frendList.length = 0
    frendList.push(...flresponse)

    const apdata = await getAppList()
    appList.length = 0
    appList.push(...apdata)
    console.log(appList)
    loading.value = false
  }
  catch (err) {
    console.error('Error fetching data:', err)
    loading.value = false
  }
}

// 分享给朋友
function shareWithFriends() {
  isSharePopupVisible.value = true
  console.log('打开分享弹窗')
}

// 关闭分享弹窗
function closeSharePopup() {
  isSharePopupVisible.value = false
  console.log('关闭分享弹窗')
}

// 分享至社媒
function sharemsg() {
  Message.error({
    content: '分享功能待实现',
    duration: 3000,
  })
}

// 去查看
function goToView() {
  router.push(`/activity-detail/${activityId.value}`)
}

// 组件挂载时获取数据
onMounted(() => {
  fetchActivityData()
  fetchFrendandAppdata()
})
</script>

<template>
  <header>
    <t-navbar title="购买结果" left-arrow :on-left-click="$router.back" class="tnavbar" />
  </header>
  <div class="buy-result-page">
    <!-- 成功状态 -->
    <t-result class="result-status" theme="success" title="购买成功" description="" />

    <!-- 活动信息卡片 -->
    <div class="activity-card">
      <t-image :src="activity.cover" alt="活动封面" fit="cover" class="activity-cover" />
      <h3 class="activity-name">
        {{ activity.name }}
      </h3>
      <div class="activity-details">
        <div class="detail-item">
          <TimeIcon size="16px" />
          <span>{{ activity.date }}</span>
        </div>
        <div class="detail-item">
          <LocationIcon size="16px" />
          <span>{{ activity.address }}</span>
        </div>
      </div>
    </div>

    <!-- 报名人员 -->
    <h3 class="section-title">
      报名人员
    </h3>
    <div class="person-info">
      <t-avatar
        class="person-avatar"
        image="https://tdesign.gtimg.com/mobile/demos/avatar1.png"
      />
      <div class="person-details">
        <div class="person-name">
          {{ selectedPerson.name }}
        </div>
        <div class="person-desc">
          {{ selectedPerson.age }} {{ selectedPerson.occupation }}
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="action-buttons">
      <t-button
        theme="light"
        variant="outline"
        block
        size="large"
        :icon="share"
        borderless
        @click="shareWithFriends"
      >
        分享给朋友
      </t-button>
      <t-button
        theme="primary"
        block
        size="large"
        borderless
        @click="goToView"
      >
        去查看
      </t-button>
    </div>
  </div>

  <!-- 分享弹窗 -->
  <t-popup
    v-model:visible="isSharePopupVisible"
    placement="bottom"
    :close-on-overlay-click="true"
    :prevent-scroll-through="true"
  >
    <div class="share-popup">
      <div class="share-section">
        <h3 class="share-title">
          分享给朋友
        </h3>
        <t-grid :column="0" class="grid-scroll">
          <t-grid-item v-for="frend in frendList" :key="frend.id" :text="frend.name" @click="sharemsg">
            <template #image>
              <t-avatar :image="frend.avatar" size="40px" />
            </template>
          </t-grid-item>
        </t-grid>
      </div>

      <div class="share-section">
        <h3 class="share-title">
          分享到社媒
        </h3>
        <t-grid :column="0" class="grid-scroll">
          <t-grid-item v-for="app in appList" :key="app.id" :text="app.name" @click="sharemsg">
            <template #image>
              <t-image :src="app.icon" :style="{ width: '40px', height: '40px' }" />
            </template>
          </t-grid-item>
        </t-grid>
      </div>
      <t-button class="share-cancel" block variant="text" @click="closeSharePopup">
        取消
      </t-button>
    </div>
  </t-popup>
</template>

<style lang="less" scoped>
.text-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tnavbar {
  --td-navbar-bg-color: var(--bg-color-secondarypage);
}

.buy-result-page {
  .flex-col();
  padding: 0 16px;
  min-height: 100vh;
  justify-content: center;
  padding-top: var(--navbar-height);
  background-color: var(--bg-color-secondarypage);
}

.result-status {
  margin-bottom: 24px;
}

.activity-card {
  .p-16();
  height: 281px;
  background: white;
  border-radius: 12px;
  box-shadow: var(--td-shadow-3);
  .activity-cover {
    width: 100%;
    height: 175px;
    border-radius: 9.06px;
  }
  .activity-name {
    .font(18px, 600);
    .text-ellipsis();
    height: 26px;
    margin: 16px 0px 8px;
  }
  .activity-details {
    display: flex;
    .detail-item {
      &:first-child {
        margin-right: 16px;
      }
      &:last-child {
        flex-grow: 1;
        min-width: 0;
      }
      display: flex;
      align-items: center;
      margin-bottom: 4px;
      .t-icon {
        color: var(--brand-main);
        margin-right: 4px;
        flex-shrink: 0;
      }
      span {
        .font(12px, 400);
        .text-ellipsis();
      }
    }
  }
}

.section-title {
  .font(16px, 600);
  margin: 24px 0 12px 0;
}

.person-info {
  .flex-center();
  height: 82px;
  background: white;
  border-radius: 9px;
  margin-bottom: 22px;
  padding: 17px 16px;
  .person-avatar {
    margin-right: 12px;
  }
  .person-details {
    flex: 1;
    min-width: 0;
    .person-name {
      .font(16px, 400);
      margin-bottom: 4px;
    }
    .person-desc {
      .font();
      .text-ellipsis();
      color: var(--td-font-gray-2);
    }
  }
}

.action-buttons {
  display: flex;
  gap: 8px;
  padding: 16px 0;
}

/* 分享弹窗样式 */

.share-popup {
  background-color: white;
  border-radius: 12px;
  .share-section {
    .share-title {
      .font(14px, 400);
      padding: 16px 0 0 16px;
      color: var(--td-font-gray-3);
    }
  }
  .share-cancel {
    .flex-center();
    height: 48px;
    padding: 12px 16px;
    padding-bottom: calc(16px + env(safe-area-inset-bottom));
    border-top: 0.5px solid var(--gray-color-3);
    :deep(.t-button__content) {
      .font(16px, 400);
    }
  }
}

.grid-scroll {
  overflow-x: auto;
  white-space: nowrap;
  scrollbar-width: none;
  /* Firefox */
  -ms-overflow-style: none;
  /* IE and Edge */
  &::-webkit-scrollbar {
    display: none;
    /* Chrome, Safari, Opera */
  }
  :deep(.t-grid-item) {
    max-width: 80px;
    flex-basis: 80px;
    padding: 16px 20px;
  }
  :deep(.t-grid-item__image) {
    .flex-center();

    width: 40px;
    background: transparent;
  }
  :deep(.t-grid-item__title) {
    .font(12px, 400);
    .text-ellipsis();
    max-width: 72px;
    padding-top: 4px;
  }
}
</style>
