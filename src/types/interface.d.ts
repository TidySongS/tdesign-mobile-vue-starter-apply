export interface Filters {
  domain: string[]
  type: string[]
  priceRange: number[]
  dateRange: Date[]
}

export interface Activity {
  id: number
  name: string
  cover: string
  score: number
  dateRange: Date[]
  priceRange: number[]
  fieldOriented: string[]
  format: string
}
