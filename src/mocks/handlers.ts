import { http, HttpResponse } from 'msw'
import {
  fetchMockActivityList,
  fetchMockSwiperList,
} from '../mocks/activityMocks'
import { db } from './db'

export const handlers = [
  http.get('/api/users', () => {
    const users = db.user.getAll()
    return HttpResponse.json(users)
  }),
  http.get('/api/getFilteredActivittList', async ({ request }) => {
    const url = new URL(request.url)
    const sort = url.searchParams.get('sort') || 'latest'
    const page = Number(url.searchParams.get('page')) || 1
    const pageSize = Number(url.searchParams.get('pageSize')) || 5
    const filtersString = url.searchParams.get('filters')
    const filters = filtersString
      ? JSON.parse(filtersString)
      : {
          fields: [],
          formats: [],
          priceRange: [],
          dateRange: [],
        }
    const result = await fetchMockActivityList({
      sort,
      page,
      pageSize,
      filters,
    })
    return HttpResponse.json(result)
  }),

  http.get('/api/getSwiperList', async () => {
    const result = await fetchMockSwiperList()
    return HttpResponse.json(result)
  }),
]
