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

// 活动详情内容
