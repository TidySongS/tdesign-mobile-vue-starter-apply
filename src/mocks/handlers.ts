import { http, HttpResponse } from 'msw'
import { db } from './db'

export const handlers = [
  http.get('/api/users', () => {
    const users = db.user.getAll()
    return HttpResponse.json(users)
  }),
]
