import type { Activity, Filters } from '@/types/interface'
import { defaultFilterOptions } from '@/hooks/useFilters'

const swiperList = [
  '/imgs/activity/sicc-2019.png',
  '/imgs/activity/sicc-2021.png',
  '/imgs/activity/sicc-2019.png',
  '/imgs/activity/sicc-2021.png',
  '/imgs/activity/sicc-2019.png',
  '/imgs/activity/sicc-2021.png',
]

const activityList = [
  {
    id: 1,
    name: '2019 SICC服务设计创新大会',
    cover: '/imgs/activity/cover-1.png',
    star: 5,
    priceRange: [],
    dateRange: [new Date(2024, 3, 10), new Date(2024, 3, 18)],
    fieldOriented: ['IT互联网', '科技'],
    format: '讲座',
  },
  {
    id: 2,
    name: '2021 SICC服务设计创新大会',
    cover: '/imgs/activity/cover-2.png',
    star: 4.5,
    priceRange: [88, 228],
    dateRange: [new Date(2024, 2, 12), new Date(2024, 3, 18)],
    fieldOriented: ['IT互联网', '科技'],
    format: '讲座',
  },

  {
    id: 3,
    name: '少年与星空 插画巡展',
    cover: '/imgs/activity/cover-3.png',
    star: 4.5,
    priceRange: [98, 118],
    dateRange: [new Date(2025, 2, 15), new Date(2025, 2, 20)],
    fieldOriented: ['艺术设计'],
    format: '展览',
  },
  {
    id: 4,
    name: 'Universe AI艺术展',
    cover: '/imgs/activity/cover-4.png',
    star: 3.5,
    priceRange: [128, 228],
    dateRange: [new Date(2024, 8, 10), new Date(2024, 8, 15)],
    fieldOriented: ['艺术设计'],
    format: '展览',
  },
  {
    id: 5,
    name: '第一届SICC服务创新大会',
    cover: '/imgs/activity/sicc-2019.png',
    star: 3.5,
    priceRange: [98, 118],
    dateRange: [new Date(2023, 6, 20), new Date(2023, 6, 25)],
    fieldOriented: ['IT互联网', '科技'],
    format: '讲座',
  },
  {
    id: 6,
    name: '星空与少年 插画巡展',
    cover: '/imgs/activity/cover-3.png',
    star: 3.5,
    priceRange: [0],
    dateRange: [new Date(2023, 5, 1), new Date(2023, 5, 5)],

    fieldOriented: ['艺术设计'],
    format: '展览',
  },
  {
    id: 7,
    name: '第三届SICC服务创新大会',
    cover: '/imgs/activity/sicc-2021.png',
    star: 3.5,
    priceRange: [88, 228],
    dateRange: [new Date(2023, 4, 12), new Date(2023, 4, 18)],
    fieldOriented: ['IT互联网', '科技'],
    format: '讲座',
  },
  {
    id: 8,
    name: '前端技术深度工作坊',
    cover: 'https://tdesign.gtimg.com/mobile/demos/swiper1.png',
    star: 3.5,
    priceRange: [98, 118],
    dateRange: [new Date(2023, 10, 10), new Date(2023, 10, 15)],
    fieldOriented: ['IT互联网'],
    format: '工作坊',
  },
  {
    id: 9,
    name: 'AI赋能未来设计峰会',
    cover: 'https://tdesign.gtimg.com/mobile/demos/swiper2.png',
    star: 3.5,
    priceRange: [128, 228],
    dateRange: [new Date(2023, 7, 16), new Date(2023, 7, 19)],
    fieldOriented: ['IT互联网', '科技'],
    format: '讲座',
  },
  {
    id: 10,
    name: '数字营销与电商增长大会',
    cover: 'https://tdesign.gtimg.com/mobile/demos/example1.png',
    star: 3,
    priceRange: [],
    dateRange: [new Date(2023, 3, 16), new Date(2023, 3, 18)],
    fieldOriented: ['电商'],
    format: '讲座',
  },
  {
    id: 11,
    name: '现代摄影艺术展',
    cover: 'https://tdesign.gtimg.com/mobile/demos/example2.png',
    star: 3.5,
    priceRange: [100],
    dateRange: [new Date(2023, 3, 22), new Date(2023, 3, 28)],
    fieldOriented: ['摄影', '艺术设计'],
    format: '展览',
  },

  {
    id: 12,
    name: '教育科技创新论坛',
    cover: 'https://tdesign.gtimg.com/mobile/demos/example3.png',
    star: 3,
    priceRange: [350, 500],
    dateRange: [new Date(2023, 2, 16), new Date(2023, 2, 20)],
    fieldOriented: ['教育', '科技'],
    format: '讲座',
  },
]

let activeRequestController: AbortController | null = null

export async function fetchMockActivityList(
  payload: {
    sort: string
    page: number
    pageSize: number
  },
  filters: Filters,
): Promise<{ data: Activity[], total: number }> {
  if (activeRequestController) {
    activeRequestController.abort()
  }
  activeRequestController = new AbortController()
  const signal = activeRequestController.signal
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      if (signal.aborted) {
        reject(new DOMException('Request aborted', 'AbortError'))
        return
      }

      let filteredResult = activityList

      if (filters.fields.length > 0) {
        filteredResult = filteredResult.filter(activity =>
          filters.fields.some((field: string) =>
            activity.fieldOriented.includes(field),
          ),
        )
      }

      if (filters.formats.length > 0) {
        filteredResult = filteredResult.filter(activity =>
          filters.formats.includes(activity.format),
        )
      }

      const [minPrice, maxPrice] = filters.priceRange
      if (
        minPrice !== defaultFilterOptions.priceRange[0]
        || maxPrice !== defaultFilterOptions.priceRange[1]
      ) {
        filteredResult = filteredResult.filter((activity) => {
          if (activity.priceRange.length === 0)
            return maxPrice === 0
          if (activity.priceRange.length === 1) {
            return (
              activity.priceRange[0] >= minPrice
              && activity.priceRange[1] <= maxPrice
            )
          }
          return (
            activity.priceRange[1] >= minPrice
            && activity.priceRange[0] <= maxPrice
          )
        })
      }
      const [startDate, endDate] = filters.dateRange
      if (
        startDate.getTime() !== defaultFilterOptions.dateRange[0].getTime()
        || endDate.getTime() !== defaultFilterOptions.dateRange[1].getTime()
      ) {
        filteredResult = filteredResult.filter((activity) => {
          return (
            activity.dateRange[1] >= startDate
            && activity.dateRange[0] <= endDate
          )
        })
      }

      if (payload.sort === 'top') {
        filteredResult.sort((a, b) => b.star - a.star)
      }
      else if (payload.sort === 'latest') {
        filteredResult.sort(
          (a, b) => b.dateRange[0].getTime() - a.dateRange[0].getTime(),
        )
      }
      const total = filteredResult.length
      const { page, pageSize } = payload
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const paginatedData = filteredResult.slice(start, end)

      resolve({ data: paginatedData, total })
    }, 1000)
    signal.addEventListener('abort', () => {
      clearTimeout(timeoutId)
      reject(new DOMException('Request aborted', 'AbortError'))
    })
  })
}

export async function fetchMockSwiperList(): Promise<{ data: string[] }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: swiperList })
    }, 1000)
  })
}
