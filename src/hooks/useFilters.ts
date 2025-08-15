import type { Filters } from '@/types/interface'

export const defaultFilterOptions: Filters = {
  fields: [
    'IT互联网',
    '艺术设计',
    '科技',
    '电商',
    '教育',
    '医疗健康',
    '心理学',
    '摄影',
  ],
  formats: ['讲座', '展览', '工作坊'],
  priceRange: [0, 588],
  dateRange: [new Date(2023, 2, 10), new Date()],
}

function createInitialFilters(options: Filters): Filters {
  return {
    fields: [],
    formats: [],
    priceRange: [...options.priceRange],
    dateRange: options.dateRange.map((d: Date) => new Date(d)),
  }
}

export function copyFilters(filters: Filters): Filters {
  const pristineCopyFilters: any = {}

  for (const key in filters) {
    if (Object.prototype.hasOwnProperty.call(filters, key)) {
      const filterKey = key as keyof Filters
      if (filterKey === 'dateRange') {
        pristineCopyFilters[filterKey] = filters.dateRange.map(
          (d: Date) => new Date(d),
        )
      }
      else {
        pristineCopyFilters[filterKey] = filters[filterKey]
      }
    }
  }
  return pristineCopyFilters
}

export function useFilters(initialOptions = defaultFilterOptions) {
  const initialValues = createInitialFilters(initialOptions)
  const filters = reactive<Filters>(initialValues)

  const resetFilters = () => {
    const clonedInitialValues = createInitialFilters(initialOptions)
    for (const key in clonedInitialValues) {
      if (Object.prototype.hasOwnProperty.call(clonedInitialValues, key)) {
        (filters[key as keyof Filters] as any)
          = clonedInitialValues[key as keyof Filters]
      }
    }
  }

  return {
    filters,
    resetFilters,
  }
}
