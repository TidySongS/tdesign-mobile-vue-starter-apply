<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const activityId = computed(() => (route.params as {
  id: string
}).id)

// 处理购买按钮点击
function handleBuyClick() {
  router.push(`/buy-confirm?eventId=${activityId.value}`)
}
</script>

<template>
  <div class="activity-detail-page">
    <header>
      <t-navbar title="活动详情" left-arrow :on-left-click="$router.back" />
    </header>
    <main>
      <p style="margin: 48px 16px;">
        id:{{ activityId }}
      </p>
    </main>
    <!-- 底部购买按钮 -->
    <div class="bottom-action">
      <t-button theme="primary" block size="large" @click="handleBuyClick">
        确认购买
      </t-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
    .activity-detail-page {
        min-height: 100vh;
        background-color: #fff;
        padding-bottom: 80px;
    }

    .bottom-action {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: white;
        padding: 16px;
        border-top: 1px solid #e5e5e5;
        box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
    }
</style>
