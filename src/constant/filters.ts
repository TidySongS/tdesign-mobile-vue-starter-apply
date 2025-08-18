import type { Filters } from '@/types/interface'

export const defaultFilterOptions: Filters = {
  domain: [
    'IT互联网',
    '艺术设计',
    '科技',
    '电商',
    '教育',
    '医疗健康',
    '心理学',
    '摄影',
  ],
  type: ['讲座', '展览', '工作坊'],
  priceRange: [0, 588],
  dateRange: [new Date(2023, 2, 10), new Date()],
}
