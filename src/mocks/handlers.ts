import { http, HttpResponse } from 'msw'
import { db } from './db'

export const handlers = [
  // 用户相关API
  http.get('/api/users', () => {
    const users = db.user.getAll()
    return HttpResponse.json(users)
  }),

  // 活动相关API
  http.get('/api/activities', () => {
    const activities = db.activity.getAll()
    return HttpResponse.json(activities)
  }),

  http.get('/api/activities/:id', ({ params }) => {
    const id = Number(params.id)
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
    const id = Number(params.id)
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
    const id = Number(params.id)
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
