import axios from '@/utils/request'

interface ActivityParams {
  title?: string
  score?: number
  minPrice?: number
  maxPrice?: number
  isHighScore?: boolean
  domain?:
    | 'IT互联网'
    | '艺术设计'
    | '科技'
    | '电商'
    | '教育'
    | '医疗健康'
    | '心理学'
    | '摄影'
  type?: '讲座' | '展览' | '工作坊'
  date?: Date
}

interface PersonActivityParams {
  personId?: string
  status?: '已完成' | '待参加'
  date?: Date
}

interface PaginationParams {
  page?: number
  pageSize?: number
}

export function getActivities(params: ActivityParams & PaginationParams) {
  return axios.get('/activities', { params })
}

export function getHomeSwiper() {
  return axios.get('/homeSwiper')
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
