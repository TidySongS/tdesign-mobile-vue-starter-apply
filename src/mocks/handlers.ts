import { http, HttpResponse } from 'msw'
import { db } from './db'

export const handlers = [
  http.get('/api/activities', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10)
    const highScoreParam = url.searchParams.get('highScore')
    const domainParam = url.searchParams.get('domain')
    const typeParam = url.searchParams.get('type')
    const startDateParam = url.searchParams.get('startDate')
    const endDateParam = url.searchParams.get('endDate')
    const titleParam = url.searchParams.get('title')

    let all = db.activity.getAll()
    // 如果有 highScore 参数，就做过滤
    if (highScoreParam !== null) {
      const flag = highScoreParam === 'true'
      all = all.filter(item => item.isHighScore === flag)
    }

    // Filter by domain
    if (domainParam) {
      all = all.filter(item => item.domain === domainParam)
    }

    // Filter by type
    if (typeParam) {
      all = all.filter(item => item.type === typeParam)
    }

    // Filter by title
    if (titleParam) {
      all = all.filter(item => item.title.includes(titleParam))
    }

    // Filter by date range
    if (startDateParam && endDateParam) {
      const startDate = new Date(startDateParam)
      const endDate = new Date(endDateParam)
      all = all.filter((item) => {
        const itemDate = new Date(item.date)
        return itemDate >= startDate && itemDate <= endDate
      })
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
