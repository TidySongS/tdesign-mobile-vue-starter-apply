<script setup lang="ts">
    import userInfo from '@/store/userInfo'
    import {
        Message
    } from 'tdesign-mobile-vue';

    const route = useRoute()
    const router = useRouter()

    // 活动ID
    const activityId = computed(() => {
            return route.query.eventId || null
        })
        // 活动信息
    const eventTitle = ref('')
    const eventDate = ref('')
    const eventLocation = ref('')

    // 加载状态
    const loading = ref(true)
    const error = ref(false)

    // 人员信息 - 从store中获取
    const persons = computed(() => userInfo.persons)

    // 选中的人员ID数组 - 从store中获取
    const selectedPersonIds = computed({
        get: () => userInfo.selectedPersonIds,
        set: (value) => {
            userInfo.selectedPersonIds = value
        }
    })

    // 票类场次
    const tickets = reactive([])
        // 选中的票类场次ID
    const selectedTicketId = ref('')

    // 票档价格
    const prices = reactive([])
        // 选中的票档价格ID
    const selectedPriceId = ref('')

    // 计算总价
    const totalPrice = computed(() => {
        const selectedPrice = prices.find(p => p.id === selectedPriceId.value)
        if (!selectedPrice) return 0

        const personCount = selectedPersonIds.value.length
        const ticketPersonCount = selectedPrice.person

        // 如果是单人票，直接计算票价乘人数
        if (ticketPersonCount === 1) {
            return selectedPrice.price * personCount
        }

        // 如果选择的人数可以被票的person属性整除，计算对应的总价
        if (personCount >= ticketPersonCount && personCount % ticketPersonCount === 0) {
            return selectedPrice.price * (personCount / ticketPersonCount)
        }

        // 默认返回单张票价
        return selectedPrice.price
    })

    // 验证购买条件
    const validatePurchase = () => {
        const selectedPrice = prices.find(p => p.id === selectedPriceId.value)
        if (!selectedPrice) return {
            valid: false,
            message: '请选择票档'
        }

        const personCount = selectedPersonIds.value.length
        const ticketPersonCount = selectedPrice.person

        // 如果选择的人数少于票的person属性个数
        if (personCount < ticketPersonCount) {
            return {
                valid: false,
                message: `当前票档需要至少${ticketPersonCount}人，您只选择了${personCount}人`
            }
        }

        // 如果选择的人数不能被票的person属性整除（多人票情况）
        if (ticketPersonCount > 1 && personCount % ticketPersonCount !== 0) {
            return {
                valid: false,
                message: `当前票档为${ticketPersonCount}人票，您选择的人数需要是${ticketPersonCount}的倍数`
            }
        }

        return {
            valid: true,
            message: ''
        }
    }

    // 是否可以购买
    const canPurchase = computed(() => {
        return selectedPersonIds.value.length > 0 && selectedTicketId.value && selectedPriceId.value
    })

    // 获取活动信息
    async function fetchActivityData() {
        if (!activityId.value) {
            console.log(activityId.value)
            error.value = true
            loading.value = false
            return
        }

        try {
            // 获取活动详情
            const activityResponse = await fetch(`/api/activities/${activityId.value}`)
            if (!activityResponse.ok) {
                throw new Error('Failed to fetch activity')
            }
            const activityData = await activityResponse.json()
            console.log("qnfoqojvnq", activityData)

            // 设置活动信息console.log(activityData)
            eventTitle.value = activityData.title
            const date = new Date(activityData.date)
            const year = date.getFullYear()
            const month = date.getMonth() + 1
            const day = date.getDate()
            eventDate.value = `${year}年${month}月${day}日`
            eventLocation.value = activityData.address

            // 获取票类场次
            const ticketsResponse = await fetch(`/api/activities/${activityId.value}/tickets`)
            if (!ticketsResponse.ok) {
                throw new Error('Failed to fetch tickets')
            }
            const ticketsData = await ticketsResponse.json()

            // 更新票类场次数据
            tickets.length = 0
            tickets.push(...ticketsData)
            if (tickets.length > 0) {
                selectedTicketId.value = tickets[0].id
            }

            // 获取票档价格
            const pricesResponse = await fetch(`/api/activities/${activityId.value}/prices`)
            if (!pricesResponse.ok) {
                throw new Error('Failed to fetch prices')
            }
            const pricesData = await pricesResponse.json()

            // 更新票档价格数据
            prices.length = 0
            prices.push(...pricesData)
            if (prices.length > 0) {
                selectedPriceId.value = prices[0].id
            }

            loading.value = false
        } catch (err) {
            console.error('Error fetching data:', err)
            error.value = true
            loading.value = false
        }
    }

    // 处理人员选择变化
    function handlePersonChange(value: string[]) {
        selectedPersonIds.value = value
    }

    // 处理票类场次选择变化
    function handleTicketChange(value: string) {
        selectedTicketId.value = value
    }

    // 处理票档价格选择变化
    function handlePriceChange(value: string) {
        selectedPriceId.value = value
    }

    // 增加人员
    function addPerson() {
        router.push('/person-info')
    }

    // 确认购买
    function handleConfirmPurchase() {
        // 验证购买条件
        const validation = validatePurchase()
        if (!validation.valid) {
            // 使用TDesign的Message组件显示提示信息
            Message.warning({
                content: validation.message,
                duration: 3000
            })
            return
        }

        console.log(activityId.value);
        setTimeout(() => 0, 2000)
            // 跳转到购买结果页面并传递订单信息
        router.push({
            path: '/buy-result',
            query: {
                eventId: activityId.value,
                totalPrice: totalPrice.value.toString()
            }
        })
    }
    // 组件挂载时获取数据
    onMounted(() => {
        fetchActivityData()
    })
</script>

<template>
  <div class="buy-confirm-page">
    <!-- <t-loading :loading="loading" theme="dots" size="large" class="loading-container" /> -->
    
    <template v-if="!loading && !error">
      <header>
        <t-navbar title="购买确认" left-arrow :on-left-click="$router.back" />
        <div class="event-container">
          <div class="flex-center">
            <span>{{ eventTitle }}</span>
          </div>
          <div class="event-details">
            <div class="detail-item">
              <t-icon name="time" size="16" />
              <span>{{ eventDate }}</span>
            </div>
            <div class="detail-item">
              <t-icon name="location" size="16" />
              <span>{{ eventLocation }}</span>
            </div>
          </div>
          <t-divider />
        </div>
      </header>
      <div class="page-content">
        <!-- 人员信息 -->
        <div class="section">
          <div class="section-header">
            <h3 class="section-title">人员信息</h3>
            <t-button size="small" shape="round" @click="addPerson">
              + 增加人员
            </t-button>
          </div>
        <t-checkbox-group v-model="selectedPersonIds" class="person-grid" borderless>
          <div 
            v-for="person in persons" 
            :key="person.id" 
            :class="`card ${selectedPersonIds.indexOf(person.id) > -1 ? 'card--active' : ''}`"
          >
            <TIcon 
              v-if="selectedPersonIds.indexOf(person.id) > -1" 
              name="check" 
              class="card__icon" 
              :aria-hidden="true" 
            />
            <t-checkbox :value="person.id" :label="person.name" icon="none" />
          </div>
        </t-checkbox-group>
      </div>

      <!-- 票类场次 -->
      <div class="section">
        <h3 class="section-title">票类场次</h3>
        <t-radio-group v-model="selectedTicketId" @change="handleTicketChange">
          <div 
            v-for="ticket in tickets" 
            :key="ticket.id" 
            :class="`card ${selectedTicketId === ticket.id ? 'card--active' : ''}`"
          >
            <TIcon 
              v-if="selectedTicketId === ticket.id" 
              name="check" 
              class="card__icon" 
            />
            <t-radio 
              :value="ticket.id" 
              :label="ticket.date" 
              icon="none" 
              borderless 
            />
          </div>
        </t-radio-group>
      </div>

      <!-- 票档价格 -->
      <div class="section">
        <h3 class="section-title">票档价格</h3>
        <t-radio-group v-model="selectedPriceId" @change="handlePriceChange">
          <div 
            v-for="price in prices" 
            :key="price.id" 
            :class="`card ${selectedPriceId === price.id ? 'card--active' : ''}`"
          >
            <TIcon 
              v-if="selectedPriceId === price.id" 
              name="check" 
              class="card__icon" 
            />
            <div class="price-card-content">
              <t-radio 
                :value="price.id" 
                :label="price.description" 
                icon="none" 
                borderless 
              />
              <div class="price-amount">
                <span class="current-price">¥{{ price.price }}</span>
                <span v-if="price.originalPrice > price.price" class="original-price">¥{{ price.originalPrice }}</span>
              </div>
            </div>
</div>
</t-radio-group>
</div>
</div>

<!-- 底部操作栏 -->
<div class="bottom-action-bar">
    <div class="price-info">
        <span class="price-label">待支付:</span>
        <span class="price-value">¥{{ totalPrice }}</span>
    </div>
    <t-button theme="primary" size="large" :disabled="!canPurchase" @click="handleConfirmPurchase">
        确认购买
    </t-button>
      </div>
    </template>

<!-- <t-empty v-if="!loading && error" description="加载失败，请重试">{{ error }}</t-empty> -->
<div v-if="!loading && error">{{ error }}</div>
</div>
</template>

<style lang="less" scoped>
    @import "@/style/main.less";
    header {
        top: 0;
        z-index: 99;
        height: 120px;
        position: sticky;
        background: white;
        .event-container {
            margin-top: 10px;
            padding: 16px;
            flex-direction: column;
            top: 48px;
            position: fixed;
            background: white;
            width: 100%;
            box-sizing: border-box;
            align-items: flex-start;
        }
    }
    
    .buy-confirm-page {
        margin-top: 10px;
        min-height: 100vh;
        background-color: #fff;
        padding-bottom: 80px;
    }
    
    .flex-center {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin-bottom: 12px;
        span {
            font-size: 24px;
            font-weight: 600;
            color: #000000;
            line-height: 32px;
        }
    }
    
    .event-details {
        display: flex;
        flex-direction: row;
        gap: 16px;
        margin-bottom: 12px;
        .detail-item {
            display: flex;
            align-items: center;
            span {
                margin-left: 8px;
                color: #666666;
                font-size: 14px;
                font-weight: 400;
            }
            .t-icon {
                color: #0052D9;
            }
        }
    }
    
    .page-content {
        padding: 16px;
        margin-top: 30px;
    }
    
    .section {
        background: white;
        border-radius: 8px;
        padding: 6px;
        margin-bottom: 16px;
        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
        }
        .section-title {
            font-size: 16px;
            font-weight: 600;
            color: #333;
            margin: 0;
        }
    }
    /* 人员信息网格布局 */
    
    .person-grid {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
    }
    
    .person-grid .card {
        margin: 0;
    }
    
    .person-grid .card::after {
        border-width: 12px;
    }
    
    .person-grid .card__icon {
        font-size: 12px;
    }
    /* 卡片样式 */
    
    .card {
        position: relative;
        margin: 16px 0;
        border-radius: 6px;
        overflow: hidden;
        box-sizing: border-box;
        border: 1.5px solid #DCDCDC;
        /* padding: 8px; */
    }
    
    .card--active {
        border-color: #0052d9;
    }
    
    .card--active::after {
        content: '';
        display: block;
        position: absolute;
        left: 0;
        top: 0;
        width: 0;
        border: 14px solid #0052d9;
        border-bottom-color: transparent;
        border-right-color: transparent;
    }
    
    .card__icon {
        color: #fff;
        position: absolute;
        left: 1.5px;
        top: 1.5px;
        z-index: 1;
        font-size: 14px;
    }
    /* 价格卡片内容布局 */
    
    .price-card-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }
    /* 价格样式 */
    
    .price-amount {
        display: flex;
        align-items: center;
        gap: 8px;
        text-align: right;
        padding-right: 12px;
        /* 增加右侧内边距，使价格离边线远一点 */
    }
    
    .current-price {
        font-size: 16px;
        font-weight: 600;
        color: #0052d9;
    }
    
    .original-price {
        font-size: 14px;
        color: #999;
        text-decoration: line-through;
    }
    
    .bottom-action-bar {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: white;
        padding: 12px 16px;
        border-top: 1px solid #e5e5e5;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
        .price-info {
            .price-label {
                font-size: 14px;
                color: #666;
            }
            .price-value {
                font-size: 16px;
                font-weight: 600;
                color: #0052d9;
                margin-left: 4px;
            }
        }
         :deep(.t-button) {
            min-width: 120px;
        }
    }
</style>