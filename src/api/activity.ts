import axios from '@/utils/request'

export interface ActivityFilterParams {
  domain: string[]
  type: string[]
  minPrice: number
  maxPrice: number
  dateRange: Date[]
}

export type SortOption = 'latest' | 'top'

export interface PaginationParams {
  page?: number | 1
  pageSize?: number | 5
  sort?: SortOption
}

// 获取首页活动列表
export function getActivities(params: ActivityFilterParams & PaginationParams) {
  return axios.post('/activities', { params })
}

// 获取首页轮播图
export function getHomeSwiper() {
  return axios.get('/homeSwiper')
}

interface PersonActivityParams {
  personId?: string
  status?: '已完成' | '待参加'
  date?: Date
}

export function getPersonActivities(
  params: PaginationParams & PersonActivityParams,
) {
  return axios.get('/personActivities', { params })
}

// ==== Detail Types ====
export interface ActivityComment {
  id: string
  user: string
  avatar: string
  rating: number
  content: string
}

export interface ActivityInterestedPerson {
  id: string
  name: string
  avatar: string
}

export interface ActivityDetail {
  id: string
  title: string
  cover: string
  banner?: string
  guestImages?: string[]
  sceneImages?: string[]
  score: number
  minPrice: number
  maxPrice: number
  date: string | Date
  domain: string[]
  type: string
  address: string
  introduce: string
  interestedCount?: number
  comments?: ActivityComment[]
  interestedPeople?: ActivityInterestedPerson[]
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

// 详情页：获取活动详情
export function getActivityDetail(id: string): Promise<ActivityDetail> {
  return axios.get<ActivityDetail>(`/activities/${id}`) as unknown as Promise<ActivityDetail>
}

// 详情页：获取活动票类场次
export function getActivityTickets(id: string): Promise<TicketItem[]> {
  return axios.get<TicketItem[]>(`/activities/${id}/tickets`) as unknown as Promise<TicketItem[]>
}

// 详情页：获取活动票档价格
export function getActivityPrices(id: string): Promise<PriceItem[]> {
  return axios.get<PriceItem[]>(`/activities/${id}/prices`) as unknown as Promise<PriceItem[]>
}
