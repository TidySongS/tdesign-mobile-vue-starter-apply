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
        bgColor ? : string | undefined
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
        bgColor: 'var(--bg-color-secondarypage)',
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

    watch(
        () => route.name,
        (newName: string) => {
            const info = tabbarList.find((item: TabbarItem) => item.name === newName)
            if (info) {
                currentInfo.value = {...info
                }
            }
        },
    )

    function handleTabbarChange(name: string | number) {
        if (typeof name !== 'string')
            return
        router.push(name)
    }
</script>

<template>
  <header>
    <t-navbar
      :title="currentInfo.showTitle ? currentInfo.label : ''"
      class="header-navbar"
      :style="{
        '--navbar-bg-color': currentInfo.bgColor,
      }"
    >
      <template #left>
        <div
          v-if="currentInfo.showLocation"
          class="location"
          @click="router.push('/select-location')"
        >
          <t-icon name="location" size="16" />
          <span class="location__text">{{ userInfo.locationName }}</span>
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
    .location {
        display: flex;
        align-items: center;
        &__text {
            line-height: 22px;
            padding-left: 4px;
        }
    }
    
    .main-content {
        padding-top: var(--navbar-height);
        padding-bottom: var(--tabbar-height);
    }
</style>

<style lang="less">
    .header-navbar {
        z-index: 99;
        .t-navbar__content {
            background-image: url("/imgs/head-bg.png");
            background-position: left var(--status-bar-height);
            background-repeat: no-repeat;
            background-size: cover;
            background-color: var(--navbar-bg-color);
        }
        .t-navbar__left {
            margin-left: 16px;
        }
    }
</style>