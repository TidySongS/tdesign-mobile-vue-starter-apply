<script setup lang="ts">
    import {
        ShareIcon
    } from 'tdesign-icons-vue-next';
    const route = useRoute()
    const router = useRouter()

    const share = () => h(ShareIcon, {
        size: '24px'
    });

    // 活动ID
    const activityId = ref(null)
        // 活动信息
    const activity = ref({
            name: '',
            date: '',
            location: '',
            cover: ''
        })
        // 选中的人员
    const selectedPerson = ref({
            name: '蔡宣轩',
            age: '29岁',
            occupation: '设计师/艺术从业者'
        })
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
            console.log(data)

            // 设置活动信息
            activity.value = {
                name: data.name,
                date: data.date,
                location: data.location,
                cover: data.swiper,
            }
            console.log(activity.value.cover)

            loading.value = false
        } catch (err) {
            console.error('Error fetching activity data:', err)
            loading.value = false
        }
    }

    // 分享给朋友
    function shareWithFriends() {
        console.log('分享给朋友')
    }

    // 去查看
    function goToView() {
        router.push(`/activity-detail/${activityId.value}`)
    }

    // 组件挂载时获取数据
    onMounted(() => {
        fetchActivityData()
    })
</script>

<template>
  <header>
    <t-navbar title="购买结果" left-arrow :on-left-click="$router.back" />
  </header>
  <div class="buy-result-page">
    <div class="page-content">
      <!-- 成功状态 -->
      <div class="result-status">
        <div class="status-icon">
          <t-icon name="check-circle" size="48" color="#00a870" />
        </div>
        <h2 class="status-title">购买成功</h2>
      </div>

      <!-- 活动信息卡片 -->
      <div class="activity-card">
        <div class="activity-cover-container">
          <img :src="activity.cover || '/imgs/activity/sicc-2021.png'" alt="活动封面" class="activity-cover" />
        </div>
        <h3 class="activity-name">{{ activity.name }}</h3>
        <div class="activity-details">
          <div class="detail-item">
            <t-icon name="time" size="16" />
            <span>{{ activity.date }}</span>
          </div>
          <div class="detail-item">
            <t-icon name="location" size="16" />
            <span>{{ activity.location }}</span>
          </div>
        </div>
      </div>

      <!-- 报名人员 -->
      <div class="person-info">
        <h3 class="section-title">报名人员</h3>
        <div class="person-card">
          <div class="person-avatar">
            <img src="/imgs/head-bg.png" alt="头像" />
          </div>
          <div class="person-details">
            <div class="person-name">{{ selectedPerson.name }}</div>
            <div class="person-desc">{{ selectedPerson.age }} {{ selectedPerson.occupation }}</div>
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
          class="action-btn share-btn"
          @click="shareWithFriends"
        >
          分享给朋友
        </t-button>
        <t-button
          theme="primary"
          block
          size="large"
          class="action-btn"
          @click="goToView"
        >
          去查看
        </t-button>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
    .buy-result-page {
        min-height: 100vh;
        background-color: #F5F6F7;
        margin-top: 47px;
    }
    
    .page-content {
        padding: 24px 16px 16px;
    }
    
    .result-status {
        text-align: center;
        margin-bottom: 24px;
        .status-icon {
            margin-bottom: 16px;
        }
        .status-title {
            font-size: 20px;
            font-weight: 600;
            color: #333;
            margin: 0;
        }
    }
    
    .activity-card {
        background: white;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 16px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        .activity-cover-container {
            border: 1px dashed #ddd;
            border-radius: 8px;
            /* padding: 12px; */
            margin-bottom: 16px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .activity-cover {
            width: 100%;
            height: 100%;
            object-fit: contain;
            display: block;
            border-radius: 4px;
        }
        .activity-name {
            font-size: 18px;
            font-weight: 600;
            color: #333;
            margin: 16px 16px 8px;
        }
        .activity-details {
            padding: 0 16px 16px;
            .detail-item {
                display: flex;
                align-items: center;
                margin-bottom: 8px;
                &:last-child {
                    margin-bottom: 0;
                }
                .t-icon {
                    color: #0052D9;
                    margin-right: 8px;
                }
                span {
                    font-size: 14px;
                    color: #666;
                }
            }
        }
    }
    
    .person-info {
        background: white;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 32px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        .section-title {
            font-size: 16px;
            font-weight: 600;
            color: #333;
            margin: 0 0 16px 0;
        }
        .person-card {
            display: flex;
            align-items: center;
            border: 1px dashed #ddd;
            border-radius: 8px;
            padding: 12px;
            .person-avatar {
                width: 48px;
                height: 48px;
                border-radius: 50%;
                overflow: hidden;
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
    }
    
    .action-buttons {
        display: flex;
        flex-direction: row;
        gap: 12px;
    }
</style>