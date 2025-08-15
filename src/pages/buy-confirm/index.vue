<script setup lang="ts">
import { computed, defineProps, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

interface Props {
  eventId?: string
  date?: string
}

const props = defineProps<Props>()
const router = useRouter()

const eventTitle = ref('2021 SICC服务设计创新大会')
const eventDate = ref('2021年3月16日')
const eventLocation = ref('深圳市腾讯滨海大厦')

// 人员信息
const persons = reactive([
  { id: '1', name: '蔡宣轩', selected: true },
  { id: '2', name: '蔡晓萱', selected: false }
])

// 票类场次
const tickets = reactive([
  { id: '1', date: '2021年3月16日', selected: true }
])

// 票档价格
const prices = reactive([
  { 
    id: '1', 
    description: '早鸟价-单人票', 
    price: 88, 
    originalPrice: 128, 
    selected: true 
  }, 
  { 
    id: '2', 
    description: '早鸟价-双人票', 
    price: 168, 
    originalPrice: 228, 
    selected: false 
  }, 
  { 
    id: '3', 
    description: '正价-单人票', 
    price: 128, 
    originalPrice: 128, 
    selected: false 
  }, 
  { 
    id: '4', 
    description: '正价-双人票', 
    price: 228, 
    originalPrice: 228, 
    selected: false 
  }
])

// 计算总价
const totalPrice = computed(() => {
  const selectedPrice = prices.find(p => p.selected)
  return selectedPrice ? selectedPrice.price : 0
})

// 是否可以购买
const canPurchase = computed(() => {
  const selectedPerson = persons.find(p => p.selected)
  const selectedTicket = tickets.find(t => t.selected)
  const selectedPrice = prices.find(p => p.selected)
  return selectedPerson && selectedTicket && selectedPrice
})

// 选择人员
function selectPerson(personId: string) {
  persons.forEach(p => p.selected = p.id === personId)
}

// 选择票类场次
function selectTicket(ticketId: string) {
  tickets.forEach(t => t.selected = t.id === ticketId)
}

// 选择价格
function selectPrice(priceId: string) {
  prices.forEach(p => p.selected = p.id === priceId)
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
          <t-icon name="calendar" size="24" />
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
      </div>
      <t-divider />
    </header>
    <div class="page-content">
      <!-- 人员信息 -->
      <div class="section">
        <div class="section-header">
          <h3 class="section-title">人员信息</h3>
          <t-button size="small" variant="outline" @click="addPerson">
            + 增加人员
          </t-button>
        </div>
        <div class="person-list">
          <div 
            v-for="person in persons" 
            :key="person.id"
            class="person-item"
            :class="{ 'person-item--selected': person.selected }"
            @click="selectPerson(person.id)"
          >
            <t-icon 
              v-if="person.selected" 
              name="check" 
              size="16" 
              class="check-icon" 
            />
            <span class="person-name">{{ person.name }}</span>
          </div>
        </div>
      </div>

      <!-- 票类场次 -->
      <div class="section">
        <h3 class="section-title">票类场次</h3>
        <div class="ticket-list">
          <div 
            v-for="ticket in tickets" 
            :key="ticket.id"
            class="ticket-item"
            :class="{ 'ticket-item--selected': ticket.selected }"
            @click="selectTicket(ticket.id)"
          >
            <t-icon 
              v-if="ticket.selected" 
              name="check" 
              size="16" 
              class="check-icon" 
            />
            <span class="ticket-date">{{ ticket.date }}</span>
          </div>
        </div>
      </div>

      <!-- 票档价格 -->
      <div class="section">
        <h3 class="section-title">票档价格</h3>
        <div class="price-list">
          <div 
            v-for="price in prices" 
            :key="price.id"
            class="price-item"
            :class="{ 'price-item--selected': price.selected }"
            @click="selectPrice(price.id)"
          >
            <t-icon 
              v-if="price.selected" 
              name="check" 
              size="16" 
              class="check-icon" 
            />
            <div class="price-content">
              <div class="price-description">{{ price.description }}</div>
              <div class="price-amount">
                <span class="current-price">¥{{ price.price }}</span>
                <span v-if="price.originalPrice > price.price" class="original-price">¥{{ price.originalPrice }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部操作栏 -->
    <div class="bottom-action-bar">
      <div class="price-info">
        <span class="price-label">待支付:</span>
        <span class="price-value">¥{{ totalPrice }}</span>
      </div>
      <t-button 
        theme="primary" 
        size="large"
        :disabled="!canPurchase"
        @click="handleConfirmPurchase"
      >
        确认购买
      </t-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
//@import "@/style/home.less";

header {
  top: 0;
  z-index: 99;
  height: 104px;
  position: sticky;
  background: white;
  .location-container {
    .p-16();
    .flex-center();
    .font-templet(400,16px,24px);
    top: 48px;
    height: 24px;
    width: calc(100% - 32px);
    position: fixed;
    background: white;
    justify-content: space-between;
    span {
      margin-left: 4px;
    }
  }
}
.buy-confirm-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 80px;
}

.event-container {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.flex-center {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.event-details {
  display: flex;
  flex-direction: column;
  gap: 8px;

  .detail-item {
    display: flex;
    align-items: center;
    color: #666;
    font-size: 14px;

    .t-icon {
      margin-right: 8px;
      color: #999;
    }
  }
}

.page-content {
  padding: 16px;
}

.section {
  background: white;
  border-radius: 8px;
  padding: 16px;
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

.person-list {
  display: flex;
  gap: 12px;
}

.person-item {
  flex: 1;
  position: relative;
  padding: 12px 16px;
  border: 1.5px solid #e5e5e5;
  border-radius: 6px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;

  &--selected {
    border-color: #0052d9;
    background-color: #f0f7ff;

    .check-icon {
      position: absolute;
      top: -1px;
      left: -1px;
      background: #0052d9;
      color: white;
      border-radius: 0 0 6px 0;
      padding: 2px;
    }
  }

  .person-name {
    font-size: 14px;
    color: #333;
  }
}

.ticket-list {
  .ticket-item {
    position: relative;
    padding: 12px 16px;
    border: 1.5px solid #e5e5e5;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;

    &--selected {
      border-color: #0052d9;
      background-color: #f0f7ff;

      .check-icon {
        position: absolute;
        top: -1px;
        left: -1px;
        background: #0052d9;
        color: white;
        border-radius: 0 0 6px 0;
        padding: 2px;
      }
    }

    .ticket-date {
      font-size: 14px;
      color: #333;
    }
  }
}

.price-list {
  .price-item {
    position: relative;
    padding: 16px;
    border: 1.5px solid #e5e5e5;
    border-radius: 6px;
    margin-bottom: 12px;
    cursor: pointer;
    transition: all 0.2s;

    &:last-child {
      margin-bottom: 0;
    }

    &--selected {
      border-color: #0052d9;
      background-color: #f0f7ff;

      .check-icon {
        position: absolute;
        top: -1px;
        left: -1px;
        background: #0052d9;
        color: white;
        border-radius: 0 0 6px 0;
        padding: 2px;
      }
    }

    .price-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .price-description {
      font-size: 14px;
      color: #333;
    }

    .price-amount {
      display: flex;
      align-items: center;
      gap: 8px;

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
    }
  }
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
