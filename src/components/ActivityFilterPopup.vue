<script setup lang="ts">
import type { Filters } from '@/types/interface'
import { defaultFilterOptions } from '@/constant/filters'
import { copyFilters } from '@/hooks/useFilters'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  filters: {
    type: Object,
    required: true,
  },
  options: {
    type: Object,
    default: defaultFilterOptions,
  },
  onReset: { type: Function, required: true },
})

const emit = defineEmits(['update:visible', 'update:filters', 'reset'])
const calendarVisible = ref(false)
const tmpFilters = ref({ ...props.filters })
const tmpDateRange = ref(props.filters.dateRange)

watch(
  () => props.filters,
  (newFilters) => {
    tmpFilters.value = { ...newFilters }
    tmpDateRange.value = newFilters.dateRange.map((d: Date) => new Date(d))
  },
  { deep: true, immediate: true },
)

function resetFilters() {
  emit('reset')
}

function resetTmpFilters() {
  tmpFilters.value = copyFilters(props.filters as Filters)
  tmpDateRange.value = props.filters.dateRange.map((d: Date) => new Date(d))
}

function onPopupUpdate(value: boolean) {
  if (value === false)
    resetTmpFilters()
  emit('update:visible', value)
}

function closePopup() {
  resetTmpFilters()
  emit('update:visible', false)
}

function closeCalendar() {
  calendarVisible.value = false
  tmpDateRange.value = tmpFilters.value.dateRange.map((d: Date) => new Date(d))
}

function handlePriceLabel(value: any) {
  return value
}

function handleDateSelect(newDateRange: Date) {
  tmpDateRange.value = newDateRange
}

function handleDateConfirm() {
  tmpFilters.value.dateRange = tmpDateRange.value
  calendarVisible.value = false
}

function applyFilters() {
  emit('update:filters', tmpFilters.value)
  emit('update:visible', false)
}

function formatDateRange(dateRange: Date[]) {
  const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return [year, month, day]
  }
  const [startYear, startMonth, startDay] = formatDate(dateRange[0])
  if (dateRange.length === 1)
    return `${startYear}年${startMonth}月${startDay}日`
  const [endYear, endMonth, endDay] = formatDate(dateRange[1])
  if (startYear === endYear)
    return `${startYear}年${startMonth}月${startDay}日-${endMonth}月${endDay}日`
  return `${startYear}年${startMonth}月${startDay}日-${endYear}年${endMonth}月${endDay}日`
}
</script>

<template>
  <div>
    <t-popup
      :visible="props.visible"
      placement="bottom"
      @update:visible="onPopupUpdate"
    >
      <div class="popup-container">
        <div class="filter-popup flex-fill-col">
          <div class="filter-popup__header flex-center">
            <span> 全部筛选 </span>
            <t-icon name="close" size="24" @click="closePopup" />
          </div>
          <div class="filter-popup__content">
            <div class="checktag-group">
              <TagFilter
                v-model:model-value="tmpFilters.domain"
                title="面向领域"
                :options="options.domain"
              />
              <TagFilter
                v-model:model-value="tmpFilters.type"
                title="活动形式"
                :options="options.type"
              />
            </div>
            <div class="filter">
              <h4>活动日期</h4>
              <div class="date-range-container flex-center">
                <span>{{ formatDateRange(tmpFilters.dateRange) }}</span>
                <t-button
                  theme="default"
                  size="extra-small"
                  shape="round"
                  @click="calendarVisible = true"
                >
                  选择日期
                </t-button>
              </div>
            </div>
            <div class="filter">
              <h4>价格范围(元)</h4>
              <t-slider
                v-model="tmpFilters.priceRange"
                range
                :min="options.priceRange[0]"
                :max="options.priceRange[1]"
                :label="handlePriceLabel"
                show-extreme-value
              />
            </div>
          </div>
          <div class="filter-popup__footer flex-center">
            <t-button
              theme="light"
              variant="base"
              type="reset"
              size="large"
              @click="resetFilters"
            >
              重置
            </t-button>
            <t-button
              theme="primary"
              type="submit"
              size="large"
              @click="applyFilters"
            >
              完成
            </t-button>
          </div>
        </div>
      </div>
    </t-popup>
    <t-popup
      v-model="calendarVisible"
      placement="bottom"
      :overlay-props="{ backgroundColor: 'transparent' }"
      @close="closeCalendar"
    >
      <div class="popup-container calendar-container">
        <t-calendar
          :use-popup="false"
          :min-date="options.dateRange[0]"
          :max-date="options.dateRange[1]"
          :value="tmpDateRange"
          type="range"
          @select="handleDateSelect"
        >
          <template #title>
            <div class="calendar-title-container flex-center">
              <t-icon name="chevron-left" size="24" @click="closeCalendar" />
              <div class="calendar-title">
                选择日期
              </div>
              <t-icon name="close" size="24" @click="closeCalendar" />
            </div>
          </template>
        </t-calendar>
        <div class="confirm-date-btn flex-center">
          <t-button theme="primary" size="large" @click="handleDateConfirm">
            确定日期
          </t-button>
        </div>
      </div>
    </t-popup>
  </div>
</template>

<style scoped lang="less">
@import "@/style/home.less";

.popup-container {
  .flex-col();
  padding: 16px 0;
  box-sizing: border-box;
  height: min(100vh - 16px, 656px);
}

.filter-popup {
  padding: 0 16px;
  overflow: hidden;
  &__header {
    .font(18px, 600);
    height: 26px;
    margin-bottom: 14px;
    span {
      margin-left: 24px;
      text-align: center;
      flex: 1;
    }
  }

  &__content {
    flex-grow: 1;
    height: auto;
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
    scrollbar-width: none;
  }

  &__footer {
    gap: 8px;
    height: 48px;
    margin-top: 16px;
    background: var(--bg-color-page);
    button {
      flex: 1;
    }
  }
}

.filter {
  padding: 24px 0;
  height: auto;
  box-sizing: border-box;
  border-top: 0.5px solid var(--gray-color-3);
}

.date-range-container {
  .font(16px, 400);
  margin-top: 8px;
  justify-content: space-between;
}

.calendar-container {
  position: relative;
  padding-bottom: 80px;
  :deep(.t-calendar__title) {
    padding-top: 0;
  }

  :deep(.t-calendar__days) {
    .t-calendar__days-item {
      &::before {
        content: "周";
      }
    }
  }

  :deep(.t-calendar__months) {
    height: 472px;
  }
}

.calendar-title-container {
  width: 100%;

  .calendar-title {
    margin: auto;
  }
}

.confirm-date-btn {
  bottom: 0;
  width: 100%;
  z-index: 9999;
  position: absolute;
  background: var(--bg-color-page);
  .t-button {
    margin: 16px;
    flex: 1;
  }
}
</style>
