import { defaultFilterOptions } from '@/constant/filters'

export interface Filters {
  domain: string[]
  type: string[]
  priceRange: number[]
  dateRange: Date[]
}

function createInitialFilters(options: Filters): Filters {
  return {
    domain: [],
    type: [],
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
