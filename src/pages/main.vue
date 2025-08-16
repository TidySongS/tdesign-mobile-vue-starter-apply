<script setup lang="ts">
    import {
        useRoute,
        useRouter
    } from 'vue-router'
    import userInfo from '@/store/userInfo'

    const route = useRoute()
    const router = useRouter()

    interface TabbarItem {
        label: string
        name: string
        icon: string
        showTitle ? : boolean | undefined
        showLocation ? : boolean | undefined
    }

    const tabbarList: TabbarItem[] = [{
        label: '首页',
        name: '/main/',
        icon: 'home',
        showLocation: true,
    }, {
        label: '我的',
        name: '/main/user',
        icon: 'user',
        showTitle: true,
    }, ]

    const currentInfo = ref({...tabbarList[0]
    })

    onMounted(() => {
        const info = tabbarList.find((item: TabbarItem) => item.name === route.name)
        if (info) {
            currentInfo.value = {...info
            }
        }
    })

    watch(() => (route.name), (newName: string) => {
        const info = tabbarList.find((item: TabbarItem) => item.name === newName)
        if (info) {
            currentInfo.value = {...info
            }
        }
    })

    function handleTabbarChange(name: string | number) {
        if (typeof name !== 'string')
            return
        router.push(name)
    }
</script>

<template>
  <header>
    <t-navbar :title="currentInfo.showTitle ? currentInfo.label : ''" class="header-navbar">
      <template #left>
        <div v-if="currentInfo.showLocation" @click="router.push('/select-location')">
          <t-icon name="location" />
          <span class="location-text">{{ userInfo.locationName }}</span>
        </div>
      </template>
</t-navbar>
</header>
<main class="main-content">
    <RouterView />
</main>
<footer>
    <t-tab-bar v-model="currentInfo.name" :split="false" theme="tag" @change="handleTabbarChange">
        <t-tab-bar-item v-for="item in tabbarList" :key="item.name" :value="item.name">
            {{ item.label }}
            <template #icon>
          <t-icon :name="item.icon" />
        </template>
        </t-tab-bar-item>
    </t-tab-bar>
</footer>
</template>

<style lang="less" scoped>
    .location-text {
        font-size: 14px;
        padding-left: 4px;
    }
    
    .main-content {
        margin-top: 48px;
    }
</style>

<style lang="less">
    .header-navbar {
        z-index: 99;
        .t-navbar__content {
            background-image: url('/imgs/head-bg.png');
            background-position: top center;
            background-repeat: no-repeat;
            background-size: cover;
        }
        .t-navbar__left {
            margin-left: 16px;
        }
    }
</style>