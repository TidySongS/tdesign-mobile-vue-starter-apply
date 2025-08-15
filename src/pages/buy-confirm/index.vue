<script setup lang="ts">
    import {
        computed,
        defineProps,
        reactive,
        ref
    } from 'vue'
    import {
        useRouter
    } from 'vue-router'

    interface Props {
        eventId ? : string
        date ? : string
    }

    const props = defineProps < Props > ()
    const router = useRouter()

    const eventTitle = ref('2021 SICC服务设计创新大会')
    const eventDate = ref('2021年3月16日')
    const eventLocation = ref('深圳市腾讯滨海大厦')

    // 人员信息
    const persons = reactive([{
            id: '1',
            name: '蔡宣轩'
        }, {
            id: '2',
            name: '蔡晓萱'
        }])
        // 选中的人员ID数组
    const selectedPersonIds = ref(['1'])

    // 票类场次
    const tickets = reactive([{
            id: '1',
            date: '2021年3月16日'
        }])
        // 选中的票类场次ID
    const selectedTicketId = ref('1')

    // 票档价格
    const prices = reactive([{
            id: '1',
            description: '早鸟价-单人票',
            price: 88,
            originalPrice: 128
        }, {
            id: '2',
            description: '早鸟价-双人票',
            price: 168,
            originalPrice: 228
        }, {
            id: '3',
            description: '正价-单人票',
            price: 128,
            originalPrice: 128
        }, {
            id: '4',
            description: '正价-双人票',
            price: 228,
            originalPrice: 228
        }])
        // 选中的票档价格ID
    const selectedPriceId = ref('1')

    // 计算总价
    const totalPrice = computed(() => {
        const selectedPrice = prices.find(p => p.id === selectedPriceId.value)
        return selectedPrice ? selectedPrice.price : 0
    })

    // 是否可以购买
    const canPurchase = computed(() => {
        return selectedPersonIds.value.length > 0 && selectedTicketId.value && selectedPriceId.value
    })

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
        if (canPurchase.value) {
            router.push('/buy-result')
        }
    }
</script>

<template>
  <div class="buy-confirm-page">
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
</div>
</template>

<style lang="less" scoped>
    @import "@/style/home.less";
    header {
        top: 0;
        z-index: 99;
        height: 104px;
        position: sticky;
        background: white;
        .event-container {
            .p-16();
            .flex-center();
            .font-templet(400, 16px, 24px);
            flex-direction: column;
            top: 48px;
            height: 74px;
            width: calc(100% - 32px);
            position: fixed;
            background: white;
            justify-content: space-between;
            align-items: flex-start;
            margin-left: 16px;
            .event-details {
                display: flex;
                align-items: center;
                .detail-item {
                    display: flex;
                    align-items: center;
                    span {
                        margin-left: 4px; // 图标和文字之间的间距
                        color: #000000e6;
                        font-size: 14px;
                        font-weight: 400;
                    }
                    .t-icon {
                        color: #0052D9;
                    }
                }
            }
            span {
                font-size: 16px;
                color: #333;
                margin-left: 4px; // 如果需要调整事件标题的文字间距
            }
        }
    }
    
    .buy-confirm-page {
        min-height: 100vh;
        background-color: #fff;
        padding-bottom: 80px;
    }
    
    .flex-center {
        display: flex;
        align-items: center;
        gap: 8px;
        span {
            opacity: 1;
            color: #000000e6;
            font-size: 20px;
            font-weight: 600;
            font-family: "PingFang SC";
            text-align: left;
            line-height: 28px;
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