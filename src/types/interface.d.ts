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
  formattedPrice?: string
}

export interface Person {
  id: string
  name: string
  birthday?: string
  phone?: string
  idCard?: string
  email?: string
  profession?: string
  isDefault: boolean
}

export interface UserInfo {
  locationName: string
  persons: Person[]
  selectedPersonIds: string[]
  addPerson: (person: Omit<Person, 'id'>) => void
  getDefaultPerson: () => Person | undefined
}
