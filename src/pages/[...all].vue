<script setup>
const router = useRouter()

function goHome() {
  router.push('/main')
}

function goBack() {
  router.back()
}
</script>

<template>
  <div class="not-found-container">
    <t-result>
      <template #image>
        <div class="status-404__text">
          <span>404</span>
        </div>
      </template>
      <template #title>
        <div>抱歉，页面不存在</div>
      </template>
      <template #description>
        <div>这个页面似乎在数字世界的某个角落迷路了</div>
      </template>
    </t-result>
    <div class="button-group">
      <t-button theme="primary" @click="goHome">
        返回到首页
      </t-button>
      <t-button theme="default" variant="outline" @click="goBack">
        返回上一页
      </t-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  background-image: url('/imgs/head-bg.png');
  background-size: cover;
  background-repeat: no-repeat;
  overflow: hidden;
  text-align: center;
}

.status-404__text {
  font-size: 80px;
  font-weight: 700;
  color: var(--brand-main);
  line-height: 1;
  margin-bottom: 16px;
}

.button-group {
  display: flex;
  gap: 10px;
  margin: 24px 0;
}
</style>
