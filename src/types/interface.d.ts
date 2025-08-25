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

export interface TicketItem {
  id: string
  activityId: string
  date: string
}

export interface PriceItem {
  id: string
  activityId: string
  description: string
  price: number
  originalPrice: number
  person: number
}

export interface Person {
  id: string
  name: string
  avatar?: string
  birthday?: string
  phone?: string
  idCard?: string
  email?: string
  profession?: string
  isDefault: boolean
}

export interface AppItem {
  id: string
  name: string
  icon: string
}

export interface UserInfo {
  locationName: string
  persons: Person[]
  selectedPersonIds: string[]
  addPerson: (person: Omit<Person, 'id'>) => void
  getDefaultPerson: () => Person | undefined
}
