<script setup lang="ts">
defineProps({
  count: {
    type: Number,
    default: 4,
  },
})
</script>

<template>
  <div v-for="i in count" :key="`skeleton-${i}`" class="card">
    <t-skeleton
      animation="flashed"
      :loading="true"
      :row-col="[{ size: '120px' }]"
    />
    <div class="card-content">
      <t-skeleton
        animation="flashed"
        :loading="true"
        style="margin-bottom: 8px"
        :row-col="[{ height: '22px', width: '80%' }]"
      />
      <t-skeleton
        animation="flashed"
        :loading="true"
        :row-col="[{ height: '20px', width: '95%' }]"
      />
      <t-skeleton
        animation="flashed"
        :loading="true"
        :row-col="[{ height: '22px', width: '60%' }]"
        class="price"
      />
    </div>
  </div>
</template>

<style scoped lang="less">
@import "@/style/home.less";
</style>
