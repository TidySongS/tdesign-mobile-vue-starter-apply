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
      <div class="popup-container filter-popup">
        <div class="filter-popup__title flex-center">
          <span> 全部筛选 </span>
          <t-icon name="close" size="24" @click="closePopup" />
        </div>

        <TagFilter
          v-model:model-value="tmpFilters.fields"
          title="面向领域"
          :options="options.fields"
        />
        <TagFilter
          v-model:model-value="tmpFilters.formats"
          title="活动形式"
          :options="options.formats"
        />

        <t-divider />

        <div>
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

        <t-divider />

        <div>
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
        <div class="popup-button-group flex-center">
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

.filter-popup {
  .p-16();
  &__title {
    .font(18px, 600);
    width: 100%;
    height: 26px;
    margin-bottom: 14px;

    span {
      padding-left: 24px;
      flex: 1;
      text-align: center;
    }
  }

  h4 {
    .font(14px, 600);
  }

  .t-divider {
    margin: 24px 0;
  }

  .date-range-container {
    .font(16px, 400);
    margin-top: 8px;
    justify-content: space-between;
  }

  .t-slider {
    .font();
    padding-bottom: 24px;

    :deep(.t-slider__range-extreme) {
      .font(16px, 400);
    }
  }

  .popup-button-group {
    gap: 8px;
    width: 100%;
    margin-top: 16px;

    button {
      width: 50%;
    }
  }
}

.calendar-container {
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
    height: 474px;
  }
}

.calendar-title-container {
  width: 100%;

  .calendar-title {
    margin: auto;
  }
}

.confirm-date-btn {
  padding: 16px 16px 0 16px;

  .t-button {
    flex: 1;
  }
}
</style>
