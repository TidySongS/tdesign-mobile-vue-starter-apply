<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div>
    <t-button @click="router.push('/activity-detail')">
      活动详情
    </t-button>
    <t-button @click="router.push('/buy-confirm')">
      购买确认
    </t-button>
    <t-button @click="router.push('/buy-result')">
      购买结果
    </t-button>
    <t-button @click="router.push('/person-info')">
      个人信息
    </t-button>
    <t-button @click="router.push('/select-location')">
      地区选择
    </t-button>
  </div>
</template>

<style scoped>

</style>
