export interface Filters {
  domain: string[]
  type: string[]
  priceRange: number[]
  dateRange: Date[]
}

export interface Activity {
  id: number
  title: string
  cover: string
  score: number
  minPrice: number
  maxPrice: number
  date: Date
  domain: string[]
  type: string
}
