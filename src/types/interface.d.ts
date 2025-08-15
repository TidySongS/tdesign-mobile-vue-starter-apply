export interface Filters {
  fields: string[]
  formats: string[]
  priceRange: number[]
  dateRange: Date[]
}

export interface Activity {
  id: number
  name: string
  cover: string
  star: number
  priceRange: number[]
}
