<script setup lang="ts">
import userInfo from '@/store/userInfo'

const form = ref(null)
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
const professionColumns = [
  [{
    label: '学生',
    value: '学生',
  }, {
    label: '计算机从业者',
    value: '计算机从业者',
  }, {
    label: '医务人员',
    value: '医务人员',
  }, {
    label: '自由职业者',
    value: '自由职业者',
  }],
]

// 处理日期选择
function onDateChange(value) {
  console.log('date change: ', value)
}

function onDatePick(value) {
  console.log('date pick: ', value)
}

function onDateConfirm(value) {
  console.log('date confirm: ', value)
  if (value) {
    const date = new Date(value)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const formattedDate = `${year}年${month}月${day}日`
    formData.birthday = formattedDate
  }
  showDatePicker.value = false
}

function onDateCancel() {
  showDatePicker.value = false
}

// 处理职业选择
function onProfessionConfirm(value) {
  if (value && value[0]) {
    formData.profession = value[0]
  }
  showProfessionPicker.value = false
}

// 表单验证规则
const rules = {
  name: [{
    required: true,
    message: '请输入姓名',
    type: 'error',
  }],
  birthday: [{
    required: true,
    message: '请选择生日',
    type: 'error',
  }],
  phone: [{
    required: true,
    message: '请输入手机号',
    type: 'error',
  }, {
    pattern: /^1[3-9]\d{9}$/,
    message: '请输入正确的电话号码',
    type: 'error',
  }],
  idCard: [{
    required: true,
    message: '请输入身份证号码',
    type: 'error',
  }, {
    pattern: /^[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dX]$/i,
    message: '请输入正确的身份证号码',
    type: 'error',
  }],
  email: [{
    pattern: /^[a-z0-9][\w.-]*[a-z0-9]@[a-z0-9]+\.[a-z]+$/i,
    message: '请输入正确的邮箱',
    type: 'error',
  }],
}

// 确认保存
function handleConfirm() {
  form.value.validate().then((result) => {
    if (result === true) {
      console.log('保存个人信息:', formData)

      // 添加到userInfo store
      userInfo.addPerson({
        name: formData.name,
        birthday: formData.birthday,
        phone: formData.phone,
        idCard: formData.idCard,
        email: formData.email,
        profession: formData.profession,
        isDefault: isDefault.value,
      })

      router.back()
    }
  })
}

// 重置表单
function onReset() {
  console.log('重置表单')
}
</script>

<template>
  <header>
    <t-navbar title="个人信息" left-arrow :on-left-click="$router.back" />
  </header>
  <div class="person-info-page">
    <div class="page-content">
      <!-- 表单内容 -->
      <div class="form-section">
        <t-form ref="form" :data="formData" :rules="rules" label-align="left" show-error-message @reset="onReset" @submit="handleConfirm">
          <!-- 设为默认开关 -->
          <t-form-item label="设为默认" name="isDefault" content-align="right">
            <t-switch v-model="isDefault" />
          </t-form-item>
          <!-- 姓名 -->
          <t-form-item label="姓名" name="name" required>
            <t-input v-model="formData.name" placeholder="请输入姓名" borderless align="left" />
          </t-form-item>

          <!-- 生日 -->
          <t-form-item label="生日" name="birthday" required arrow>
            <div class="input-with-icon">
              <t-input v-model="formData.birthday" placeholder="请选择生日" borderless align="left" readonly @click="showDatePicker = true" />
              <t-icon name="calendar" size="20" @click="showDatePicker = true" />
            </div>
          </t-form-item>

          <!-- 手机号 -->
          <t-form-item label="手机号" name="phone" required>
            <t-input v-model="formData.phone" placeholder="请输入手机号" borderless align="left" />
          </t-form-item>

          <!-- 身份证 -->
          <t-form-item label="身份证" name="idCard" required>
            <t-input v-model="formData.idCard" placeholder="请输入您的身份证号码" borderless align="left" />
          </t-form-item>

          <!-- 邮箱 -->
          <t-form-item label="邮箱" name="email">
            <t-input v-model="formData.email" placeholder="请输入您的邮箱" borderless align="left" />
          </t-form-item>

          <!-- 职业 -->
          <t-form-item label="职业" name="profession" arrow>
            <t-input v-model="formData.profession" placeholder="请选择职业" borderless align="left" readonly @click="showProfessionPicker = true" />
          </t-form-item>
        </t-form>
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
      <t-date-time-picker :value="datePickerValue" title="选择生日" :mode="['date']" start="1950-01-01" end="2010-12-31" format="YYYY-MM-DD" @change="onDateChange" @pick="onDatePick" @confirm="onDateConfirm" @cancel="onDateCancel" />
    </t-popup>

    <!-- 职业选择器 -->
    <t-popup v-model="showProfessionPicker" placement="bottom">
      <t-picker v-model="professionPickerValue" title="选择职业" :columns="professionColumns" @confirm="onProfessionConfirm" @cancel="showProfessionPicker = false" />
    </t-popup>
  </div>
</template>

<style lang="less" scoped>
    header {
        position: fixed;
        z-index: 999;
    }

    .person-info-page {
        min-height: calc(100dvh - 48px);
        background-color: #fff;
        padding-bottom: 80px;
        box-sizing: border-box;
    }

    .page-content {
        padding-top: 48px;
        box-sizing: border-box;
    }

    .form-section {
        background: white;
        padding: 3px;
    }

    .bottom-action {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: white;
        padding: 20px;
        border-top: 1px solid #e5e5e5;
        box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
        box-sizing: border-box;
    }

     :deep(.t-cell) {
        padding: 16px;
        height: 56px;
        display: flex;
        align-items: center;
    }

     :deep(.t-form) {
        --td-form-label-width: 80px;
        .t-form-item {
            padding: 16px;
            margin-bottom: 16px;
            /* 增加表单项之间的间距 */
            border-bottom: 1px solid #f0f0f0;
            &:last-child {
                border-bottom: none;
                margin-bottom: 0;
            }
        }
        .t-form-item__label {
            font-size: 14px;
            color: #333;
            padding-right: 16px;
        }
        .t-input {
            text-align: left;
            .t-input__control {
                font-size: 14px;
                color: #333;
                text-align: left;
            }
            .t-input__placeholder {
                color: #999;
                text-align: left;
            }
        }
    }

     :deep(.t-switch) {
        --td-switch-checked-color: #0052d9;
    }

    .input-with-icon {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        .t-icon {
            color: #999;
            margin-right: 8px;
        }
    }
</style>
