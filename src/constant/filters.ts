import dayjs from 'dayjs'

const sixMonthsAgo = dayjs().subtract(6, 'month').toDate()
const sixMonthsLater = dayjs().add(6, 'month').toDate()

export const defaultFilterOptions = {
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
  minPrice: 0,
  maxPrice: 588,
  dateRange: [sixMonthsAgo, sixMonthsLater],
}
