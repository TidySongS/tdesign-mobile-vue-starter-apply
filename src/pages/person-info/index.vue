<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 表单数据
const formData = reactive({
  name: '蔡少宣',
  birthday: '1994年9月27日',
  phone: '18899998888',
  idCard: '',
  email: '',
  profession: '设计师/艺术从业者',
})

// 是否设为默认
const isDefault = ref(false)

// 显示日期选择器
const showDatePicker = ref(false)

// 显示职业选择器
const showProfessionPicker = ref(false)

// 日期选择器值
const datePickerValue = ref('1994-09-27')

// 职业选择器值
const professionPickerValue = ref(['设计师/艺术从业者'])

// 职业选项
const professionColumns = ['学生', '计算机从业者', '设计师/艺术从业者', '医务人员', '自由职业者']

// 处理日期选择
function onDateConfirm(value: any) {
  if (value) {
    const date = new Date(value)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    formData.birthday = `${year}年${month}月${day}日`
  }
  showDatePicker.value = false
}

// 处理职业选择
function onProfessionConfirm(value: any) {
  if (value && value[0]) {
    formData.profession = value[0]
  }
  showProfessionPicker.value = false
}

// 确认保存
function handleConfirm() {
  // 这里可以添加表单验证逻辑
  console.log('保存个人信息:', formData)
  router.back()
}
</script>

<template>
  <div class="person-info-page">
    <t-navbar title="个人信息" left-arrow :on-left-click="$router.back" />
    <div class="page-content">
      <!-- 设为默认开关 -->
      <div class="default-section">
        <t-cell title="设为默认" :right-icon="null">
          <template #right-icon>
            <t-switch v-model="isDefault" />
          </template>
        </t-cell>
      </div>

      <!-- 表单内容 -->
      <div class="form-section">
        <t-cell-group>
          <!-- 姓名 -->
          <t-cell title="姓名" :required="true">
            <template #right-icon>
              <t-input
                v-model="formData.name"
                placeholder="请输入姓名"
                :borderless="true"
              />
            </template>
          </t-cell>

          <!-- 生日 -->
          <t-cell title="生日" :required="true" arrow @click="showDatePicker = true">
            <template #right-icon>
              <span class="cell-value">{{ formData.birthday }}</span>
            </template>
          </t-cell>

          <!-- 手机号 -->
          <t-cell title="手机号" :required="true">
            <template #right-icon>
              <t-input
                v-model="formData.phone"
                placeholder="请输入手机号"
                :borderless="true"
              />
            </template>
          </t-cell>

          <!-- 身份证 -->
          <t-cell title="身份证" :required="true">
            <template #right-icon>
              <t-input
                v-model="formData.idCard"
                placeholder="请输入您的身份证号码"
                :borderless="true"
              />
            </template>
          </t-cell>

          <!-- 邮箱 -->
          <t-cell title="邮箱">
            <template #right-icon>
              <t-input
                v-model="formData.email"
                placeholder="请输入您的邮箱"
                :borderless="true"
              />
            </template>
          </t-cell>

          <!-- 职业 -->
          <t-cell title="职业" arrow @click="showProfessionPicker = true">
            <template #right-icon>
              <span class="cell-value">{{ formData.profession }}</span>
            </template>
          </t-cell>
        </t-cell-group>
      </div>
    </div>

    <!-- 底部确认按钮 -->
    <div class="bottom-action">
      <t-button theme="primary" block size="large" @click="handleConfirm">
        确定
      </t-button>
    </div>

    <!-- 日期选择器 -->
    <t-popup v-model="showDatePicker" placement="bottom">
      <t-date-time-picker
        v-model="datePickerValue"
        title="选择生日"
        :mode="['date']"
        start="1950-01-01"
        end="2010-12-31"
        format="YYYY-MM-DD"
        @confirm="onDateConfirm"
        @cancel="showDatePicker = false"
      />
    </t-popup>

    <!-- 职业选择器 -->
    <t-popup v-model="showProfessionPicker" placement="bottom">
      <t-picker
        v-model="professionPickerValue"
        title="选择职业"
        :columns="professionColumns"
        @confirm="onProfessionConfirm"
        @cancel="showProfessionPicker = false"
      />
    </t-popup>
  </div>
</template>

<style lang="less" scoped>
.person-info-page {
  min-height: 100vh;
  background-color: #fff;
  padding-bottom: 80px;
}

.page-content {
  padding-top: 16px;
}

.default-section {
  background: white;
  margin-bottom: 16px;
}

.form-section {
  background: white;
}

.cell-value {
  color: #333;
  font-size: 14px;
}

.bottom-action {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 16px;
  border-top: 1px solid #e5e5e5;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
}

:deep(.t-cell) {
  padding: 16px;

  .t-cell__title {
    font-size: 14px;
    color: #333;
  }

  .t-cell__right-icon {
    color: #999;
  }
}

:deep(.t-input) {
  text-align: right;

  .t-input__control {
    font-size: 14px;
    color: #333;
  }

  .t-input__placeholder {
    color: #999;
  }
}

:deep(.t-switch) {
  --td-switch-checked-color: #0052d9;
}
</style>
