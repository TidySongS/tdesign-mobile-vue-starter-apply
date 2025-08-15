<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

// 购买结果信息
const orderInfo = {
  orderNo: 'TD202403160001',
  amount: '¥88',
  eventName: '2021 SICC服务设计创新大会',
  eventDate: '2021年3月16日',
  eventLocation: '深圳市腾讯滨海大厦'
}

// 返回首页
function goHome() {
  router.push('/')
}

// 查看订单
function viewOrder() {
  // 这里可以跳转到订单详情页
  console.log('查看订单详情')
}
</script>

<template>
  <div class="buy-result-page">
    <t-navbar title="购买结果" left-arrow :on-left-click="$router.back" />
    
    <div class="page-content">
      <!-- 成功状态 -->
      <div class="result-status">
        <div class="status-icon">
          <t-icon name="check-circle" size="48" color="#00a870" />
        </div>
        <h2 class="status-title">购买成功</h2>
        <p class="status-desc">您的订单已提交，请及时支付</p>
      </div>

      <!-- 订单信息 -->
      <div class="order-info">
        <h3 class="section-title">订单信息</h3>
        <div class="info-list">
          <div class="info-item">
            <span class="label">订单号</span>
            <span class="value">{{ orderInfo.orderNo }}</span>
          </div>
          <div class="info-item">
            <span class="label">支付金额</span>
            <span class="value amount">{{ orderInfo.amount }}</span>
          </div>
          <div class="info-item">
            <span class="label">活动名称</span>
            <span class="value">{{ orderInfo.eventName }}</span>
          </div>
          <div class="info-item">
            <span class="label">活动时间</span>
            <span class="value">{{ orderInfo.eventDate }}</span>
          </div>
          <div class="info-item">
            <span class="label">活动地点</span>
            <span class="value">{{ orderInfo.eventLocation }}</span>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <t-button 
          theme="primary" 
          block 
          size="large" 
          @click="viewOrder"
          class="action-btn"
        >
          查看订单
        </t-button>
        <t-button 
          variant="outline" 
          block 
          size="large" 
          @click="goHome"
          class="action-btn"
        >
          返回首页
        </t-button>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.buy-result-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.page-content {
  padding: 32px 16px 16px;
}

.result-status {
  text-align: center;
  background: white;
  border-radius: 8px;
  padding: 32px 16px;
  margin-bottom: 16px;

  .status-icon {
    margin-bottom: 16px;
  }

  .status-title {
    font-size: 20px;
    font-weight: 600;
    color: #333;
    margin: 0 0 8px 0;
  }

  .status-desc {
    font-size: 14px;
    color: #666;
    margin: 0;
  }
}

.order-info {
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 32px;

  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin: 0 0 16px 0;
  }

  .info-list {
    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;

      &:last-child {
        border-bottom: none;
      }

      .label {
        font-size: 14px;
        color: #666;
      }

      .value {
        font-size: 14px;
        color: #333;
        text-align: right;
        max-width: 60%;

        &.amount {
          color: #0052d9;
          font-weight: 600;
        }
      }
    }
  }
}

.action-buttons {
  .action-btn {
    margin-bottom: 12px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
