import type { Activity } from '@/types/interface'
import { delay, http, HttpResponse } from 'msw'
import { defaultFilterOptions } from '@/constant/filters'
import { activityList } from './activityMocks'
import { db } from './db'

const swiperList = [
  {
    id: '1',
    name: '2019 SICC服务设计创新大会',
    url: '/imgs/activity/sicc-2019.png',
  },
  {
    id: '2',
    name: '2021 SICC服务设计创新大会',
    url: '/imgs/activity/sicc-2021.png',
  },
  {
    id: '3',
    name: '第一届SICC服务创新大会',
    url: '/imgs/activity/sicc-2021.png',
  },
  {
    id: '4',
    name: '第三届SICC服务创新大会',
    url: '/imgs/activity/sicc-2021.png',
  },
  {
    id: '5',
    name: '2019年SICC服务设计创新大会',
    url: '/imgs/activity/sicc-2021.png',
  },
  {
    id: '6',
    name: '2021年SICC服务设计创新大会',
    url: '/imgs/activity/sicc-2021.png',
  },
]

export const handlers = [
  // http.get('/api/activities', ({ request }) => {
  //   const url = new URL(request.url)
  //   const page = Number(url.searchParams.get('page') ?? 1)
  //   const pageSize = Number(url.searchParams.get('pageSize') ?? 10)
  //   const highScoreParam = url.searchParams.get('highScore')
  //   const domainParam = url.searchParams.get('domain')
  //   const typeParam = url.searchParams.get('type')
  //   const startDateParam = url.searchParams.get('startDate')
  //   const endDateParam = url.searchParams.get('endDate')
  //   const titleParam = url.searchParams.get('title')

  //   let all = db.activity.getAll()
  //   // 如果有 highScore 参数，就做过滤
  //   if (highScoreParam !== null) {
  //     const flag = highScoreParam === 'true'
  //     all = all.filter(item => item.isHighScore === flag)
  //   }

  //   // Filter by domain
  //   if (domainParam) {
  //     all = all.filter(item => item.domain === domainParam)
  //   }

  //   // Filter by type
  //   if (typeParam) {
  //     all = all.filter(item => item.type === typeParam)
  //   }

  //   // Filter by title
  //   if (titleParam) {
  //     all = all.filter(item => item.title.includes(titleParam))
  //   }

  //   // Filter by date range
  //   if (startDateParam && endDateParam) {
  //     const startDate = new Date(startDateParam)
  //     const endDate = new Date(endDateParam)
  //     all = all.filter((item) => {
  //       const itemDate = new Date(item.date)
  //       return itemDate >= startDate && itemDate <= endDate
  //     })
  //   }
  //   const total = all.length

  //   const start = (page - 1) * pageSize
  //   const end = start + pageSize
  //   const pageData = all.slice(start, end)

  //   return HttpResponse.json({
  //     data: pageData,
  //     pagination: {
  //       page,
  //       pageSize,
  //       total,
  //       totalPages: Math.ceil(total / pageSize),
  //     },
  //   })
  // }),

  http.get('/api/homeSwiper', () => {
    return HttpResponse.json({
      data: swiperList,
    })
  }),

  http.get('/api/activities', async ({ request }) => {
    await delay(500)
    const url = new URL(request.url)
    const sort = url.searchParams.get('sort') || ''
    const page = Number(url.searchParams.get('page')) || 1
    const pageSize = Number(url.searchParams.get('pageSize')) || 10
    const filters = url.searchParams.get('filters')
      ? JSON.parse(url.searchParams.get('filters') as string)
      : {
          domain: [],
          type: [],
          priceRange: defaultFilterOptions.priceRange,
          dateRange: defaultFilterOptions.dateRange,
        }

    let filteredResult = activityList as Activity[]

    if (filters.domain.length > 0) {
      filteredResult = filteredResult.filter(activity =>
        filters.domain.some((field: string) =>
          activity.fieldOriented.includes(field),
        ),
      )
    }

    if (filters.type.length > 0) {
      filteredResult = filteredResult.filter(activity =>
        filters.type.includes(activity.format),
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

    const startDate = new Date(filters.dateRange[0])
    const endDate = new Date(filters.dateRange[1])
    if (
      startDate.getTime() !== defaultFilterOptions.dateRange[0].getTime()
      || endDate.getTime() !== defaultFilterOptions.dateRange[1].getTime()
    ) {
      filteredResult = filteredResult.filter((activity) => {
        return (
          activity.dateRange[1] >= startDate && activity.dateRange[0] <= endDate
        )
      })
    }

    if (sort === 'top') {
      filteredResult.sort((a, b) => b.star - a.star)
    }
    else if (sort === 'latest') {
      filteredResult.sort(
        (a, b) =>
          new Date(b.dateRange[0]).getTime()
            - new Date(a.dateRange[0]).getTime(),
      )
    }

    const total = filteredResult.length
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginatedData = filteredResult.slice(start, end)

    return HttpResponse.json(
      {
        data: { paginatedData, total },
      },
      {
        status: 200,
      },
    )
  }),

  http.get('/api/personActivities', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10)
    const personIdParam = url.searchParams.get('personId')
    const statusParam = url.searchParams.get('status')

    let all = db.personActivity.getAll()

    // Filter by personId
    if (personIdParam) {
      all = all.filter(item => item.personId === personIdParam)
    }

    // Filter by status
    if (statusParam) {
      all = all.filter(item => item.status === statusParam)
    }

    const total = all.length

    const start = (page - 1) * pageSize
    const end = start + pageSize
    const pageData = all.slice(start, end)

    return HttpResponse.json({
      data: pageData,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    })
  }),

  http.get('/api/occupations', () => {
    const all = db.occupation.getAll()
    return HttpResponse.json({
      data: all,
    })
  }),
]
