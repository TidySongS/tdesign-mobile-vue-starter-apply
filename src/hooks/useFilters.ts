import type { ActivityFilterParams as Filters } from '@/api/activity'
import { defaultFilterOptions } from '@/constant/filters'

function createInitialFilters(): Filters {
  return {
    domain: [],
    type: [],
    minPrice: defaultFilterOptions.minPrice,
    maxPrice: defaultFilterOptions.maxPrice,
    dateRange: defaultFilterOptions.dateRange.map((d: Date) => new Date(d)),
  }
}

export function copyFilters(filters: Filters): Filters {
  return {
    ...filters,
    domain: [...filters.domain],
    type: [...filters.type],
    dateRange: filters.dateRange.map((d: Date) => new Date(d)),
  }
}

export function useFilters() {
  const initialValues = createInitialFilters()
  const filters = reactive<Filters>(initialValues)

  const resetFilters = () => {
    const clonedInitialValues = createInitialFilters()
    Object.assign(filters, clonedInitialValues)
  }

  return {
    filters,
    resetFilters,
  }
}
