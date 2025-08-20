import { delay, http, HttpResponse } from 'msw'
import { defaultFilterOptions } from '@/constant/filters'
import { swiperList } from './activityMocks'
import { db } from './db'

export const handlers = [
  http.get('/api/homeSwiper', () => {
    return HttpResponse.json(
      {
        data: swiperList,
      },
      { status: 200 },
    )
  }),
  http.get('/api/activities', async ({ request }) => {
    await delay(500)
    const url = new URL(request.url)
    const sort = url.searchParams.get('sort') || ''
    const page = Number(url.searchParams.get('page')) || 1
    const pageSize = Number(url.searchParams.get('pageSize')) || 5
    const filters = url.searchParams.get('filters')
      ? JSON.parse(url.searchParams.get('filters') as string)
      : defaultFilterOptions
    let filteredResult = db.activity.getAll()

    if (filters.domain.length > 0) {
      filteredResult = filteredResult.filter(activity =>
        filters.domain.some((field: string) => activity.domain.includes(field)),
      )
    }

    if (filters.type.length > 0) {
      filteredResult = filteredResult.filter(activity =>
        filters.type.includes(activity.type),
      )
    }

    const [minPrice, maxPrice] = filters.priceRange
    if (
      minPrice !== defaultFilterOptions.priceRange[0]
      || maxPrice !== defaultFilterOptions.priceRange[1]
    ) {
      filteredResult = filteredResult.filter((activity) => {
        return activity.minPrice <= maxPrice && activity.maxPrice >= minPrice
      })
    }

    const startDate = new Date(filters.dateRange[0])
    const endDate = new Date(filters.dateRange[1])
    if (
      startDate.getTime() !== defaultFilterOptions.dateRange[0].getTime()
      || endDate.getTime() !== defaultFilterOptions.dateRange[1].getTime()
    ) {
      filteredResult = filteredResult.filter((activity) => {
        return activity.date >= startDate && activity.date <= endDate
      })
    }

    if (sort === 'top') {
      filteredResult.sort((a, b) => b.score - a.score)
    }
    else if (sort === 'latest') {
      filteredResult.sort((a, b) => b.date.getTime() - a.date.getTime())
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

  http.get('/api/activities/:id', ({ params }) => {
    const id = Array.isArray(params.id) ? params.id[0] : params.id
    if (!id) {
      return new HttpResponse(null, { status: 400 })
    }

    const activity = db.activity.findFirst({
      where: {
        id: {
          equals: id,
        },
      },
    })

    if (!activity) {
      return new HttpResponse(null, { status: 404 })
    }

    return HttpResponse.json(activity)
  }),

  http.get('/api/activities/:id/tickets', ({ params }) => {
    const id = Array.isArray(params.id) ? params.id[0] : params.id
    if (!id) {
      return new HttpResponse(null, { status: 400 })
    }

    const tickets = db.ticket.findMany({
      where: {
        activityId: {
          equals: id,
        },
      },
    })

    return HttpResponse.json(tickets)
  }),

  http.get('/api/activities/:id/prices', ({ params }) => {
    const id = Array.isArray(params.id) ? params.id[0] : params.id
    if (!id) {
      return new HttpResponse(null, { status: 400 })
    }

    const prices = db.price.findMany({
      where: {
        activityId: {
          equals: id,
        },
      },
    })
    return HttpResponse.json(prices)
  }),

  http.get('/api/share/friends', () => {
    const friendList = db.friendList.getAll()
    return HttpResponse.json(friendList)
  }),

  http.get('/api/share/app', () => {
    const appList = db.shareAppIconList.getAll()
    return HttpResponse.json(appList)
  }),

  // 处理Vue开发服务器的样式请求
  http.get(/\.vue\?vue&type=style/, () => {
    return new HttpResponse(null, { status: 200 })
  }),
]
