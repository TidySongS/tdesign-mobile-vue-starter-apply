<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <header>
    <t-navbar title="活动详情" left-arrow :on-left-click="$router.back" />
  </header>
  <main>
    <p style="margin: 48px 16px;">
      id:{{ (route.params as { id: string }).id }}
    </p>
  </main>
</template>

<style lang="less" scoped></style>
