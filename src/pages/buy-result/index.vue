<script setup lang="ts">
import {
  ShareIcon,
} from 'tdesign-icons-vue-next'

const route = useRoute()
const router = useRouter()

function share() {
  return h(ShareIcon, {
    size: '24px',
  })
}

// 控制分享弹窗的显示/隐藏
const isSharePopupVisible = ref(false)

// 活动ID
const activityId = ref(null)
// 活动信息
const activity = ref({
  name: '',
  date: '',
  location: '',
  cover: '',
})
// 选中的人员
const selectedPerson = ref({
  name: '蔡宣轩',
  age: '29岁',
  occupation: '设计师/艺术从业者',
})

const frendList = reactive([])
const appList = reactive([])
// 加载状态
const loading = ref(true)

// 获取活动信息
async function fetchActivityData() {
  // 从路由参数或state中获取活动ID
  const id = route.query.eventId || (history.state && history.state.orderInfo && history.state.orderInfo.activityId)
  console.log(id)
  if (!id) {
    loading.value = false
    return
  }

  activityId.value = id

  try {
    // 获取活动详情
    const response = await fetch(`/api/activities/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch activity')
    }
    const data = await response.json()

    // 设置活动信息
    activity.value = {
      name: data.title,
      date: data.date,
      address: data.address,
      cover: data.swiper,
    }

    loading.value = false
  }
  catch (err) {
    console.error('Error fetching activity data:', err)
    loading.value = false
  }
}
// 获取朋友\app信息
async function fetchFrendandAppdata() {
  try {
    const flresponse = await fetch('/api/share/friends')
    if (!flresponse.ok)
      throw new Error('Failed to fetch friemdList')

    const fldata = await flresponse.json()
    frendList.length = 0
    frendList.push(...fldata)

    const apresponse = await fetch('api/share/app')
    if (!apresponse.ok)
      throw new Error('Failed to fetch appList')

    const apdata = await apresponse.json()
    appList.length = 0
    appList.push(...apdata)
    loading.value = false
  }
  catch (err) {
    console.error('Error fetching data:', err)
    // error.value = true
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
    <div class="page-content">
      <!-- 成功状态 -->
      <div class="result-status">
        <div class="status-icon">
          <t-icon name="check-circle" size="80px" color="#2BA471" />
        </div>
        <h2 class="status-title">
          购买成功
        </h2>
      </div>

      <!-- 活动信息卡片 -->
      <div class="activity-card">
        <img :src="activity.cover || '/imgs/activity/sicc-2021.png'" alt="活动封面" class="activity-cover">
        <h3 class="activity-name">
          {{ activity.name }}
        </h3>
        <div class="activity-details">
          <div class="detail-item">
            <t-icon name="time" size="16" />
            <span>{{ activity.date }}</span>
          </div>
          <div class="detail-item">
            <t-icon name="location" size="16" />
            <span>{{ activity.address }}</span>
          </div>
        </div>
      </div>

      <!-- 报名人员 -->
      <h3 class="section-title">
        报名人员
      </h3>
      <div class="person-info">
        <div class="person-avatar">
          <img src="/imgs/head-bg.png" alt="头像">
        </div>
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
          <t-grid-item v-for="frend in frendList" :key="frend.id" :text="frend.name">
            <template #image>
              <t-avatar :image="frend.avatar" />
            </template>
          </t-grid-item>
        </t-grid>
      </div>

      <div class="share-section">
        <h3 class="share-title">
          分享到社媒
        </h3>
        <t-grid :column="0" class="grid-scroll">
          <t-grid-item v-for="app in appList" :key="app.id" :text="app.appname" :image="app.icon" />
        </t-grid>
      </div>
      <div class="share-cancel">
        <t-button block size="large" variant="text" @click="closeSharePopup">
          取消
        </t-button>
      </div>
    </div>
  </t-popup>
</template>

<style lang="less" scoped>
    .tnavbar {
        --td-navbar-bg-color: #f5f6f7;
    }

    .buy-result-page {
        min-height: calc(100dvh - 47px);
        /* 减去navbar高度 */
        background-color: #F5F6F7;
        /* padding-top: 10px; */
        box-sizing: border-box;
    }

    .page-content {
        padding: 16px 16px 16px;
        box-sizing: border-box;
    }

    .result-status {
        text-align: center;
        margin-top: 40px;
        margin-bottom: 24px;
        .status-icon {
            margin-bottom: 16px;
        }
        .status-title {
            opacity: 1;
            color: #000000e6;
            font-size: 20px;
            font-weight: 600;
            text-align: center;
            line-height: 28px;
            margin: 0;
        }
    }

    .activity-card {
        background: white;
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 16px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        .activity-cover {
            width: 100%;
            height: auto;
            max-height: 200px;
            object-fit: cover;
            display: block;
            border-radius: 9.06px;
        }
        .activity-name {
            height: 26px;
            font-size: 18px;
            font-weight: 600;
            color: #333;
            margin: 16px 0px 8px;
        }
        .activity-details {
            /* padding: 0 16px 16px; */
            display: flex;
            flex-direction: row;
            .detail-item {
                display: flex;
                align-items: center;
                margin-right: 16px;
                margin-bottom: 10px;
                .t-icon {
                    color: #0052D9;
                    margin-right: 5px;
                }
                span {
                    font-size: 14px;
                    color: #666;
                }
            }
        }
    }

    .section-title {
        font-size: 16px;
        font-weight: 600;
        color: #000;
        margin: 24px 0 16px 0;
    }

    .person-info {
        background: white;
        border-radius: 8px;
        margin-bottom: 24px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        display: flex;
        align-items: center;
        border: 0 solid #e7e7e7;
        padding: 12px;
        .person-avatar {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            overflow: hidden;
            padding: 0;
            margin-right: 12px;
            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
        .person-details {
            flex: 1;
            .person-name {
                font-size: 16px;
                font-weight: 500;
                color: #333;
                margin-bottom: 4px;
            }
            .person-desc {
                font-size: 12px;
                color: #999;
            }
        }
    }

    .action-buttons {
        display: flex;
        flex-direction: row;
        gap: 12px;
        margin-top: 24px;
        margin-bottom: 24px;
    }
    /* 分享弹窗样式 */

    .share-popup {
        background-color: white;
        border-top-left-radius: 16px;
        border-top-right-radius: 16px;
        padding: 16px 16px;
        .share-section {
            margin-bottom: 24px;
            .share-title {
                font-size: 16px;
                font-weight: 500;
                color: #333;
                margin: 0 0 16px 0;
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
                 :deep(.t-grid__content) {
                    flex-wrap: nowrap;
                    padding: 4px 0;
                }
                 :deep(.t-grid-item) {
                    min-width: 70px;
                    flex-shrink: 0;
                }
                /* 调整社交媒体图标大小 */
                /* &:nth-child(2) {
                     :deep(.t-grid-item) {
                        --td-grid-item-image-width: 50px;
                        --td-grid-item-image-border-radius: 8px;
                        .t-image {
                            width: 50px !important;
                            height: 50px !important;
                            border-radius: 8px;
                            object-fit: contain;
                        }
                    }
                } */
            }
        }
        .share-cancel {
            margin-top: 24px;
            padding-top: 24px;
            border-top: 1px solid #f5f5f5;
             :deep(.t-button) {
                font-size: 16px;
                color: #333;
                --td-button-large-height: 10px;
            }
        }
    }
</style>
