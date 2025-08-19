import { faker } from '@faker-js/faker'
import { factory, primaryKey } from '@mswjs/data'
import { Swiper } from 'tdesign-mobile-vue'

export const db = factory({
  user: {
    id: primaryKey(Number),
    name: () => faker.person.fullName(),
    email: () => faker.internet.email(),
  },
  activity: {
    id: primaryKey(Number),
    name: String,
    cover: String,
    star: Number,
    price: String,
    location: String,
    date: String,
    swiper: String,
  },
  ticket: {
    id: primaryKey(String),
    activityId: Number,
    date: String,
  },
  price: {
    id: primaryKey(String),
    activityId: Number,
    description: String,
    price: Number,
    originalPrice: Number,
    person: Number,
  },
  friendList: {
    id: primaryKey(String),
    name: String,
    avatar: String,
  },
  shareAppIconList: {
    id: primaryKey(String),
    appname: String,
    icon: String,
  },
})

// 预生成一些假数据
for (let i = 1; i <= 10; i++) {
  db.user.create({
    id: i,
  })
}

// 活动数据
const activities = [
  {
    id: 1,
    name: '少年与星空 插画巡展',
    cover: '/imgs/activity/cover-3.png',
    star: 4.5,
    price: '¥98.00-¥118.00',
    location: '深圳市南山区科技园',
    date: '2023年5月15日',
    swiper: '/imgs/activity/sicc-2019.png',
  },
  {
    id: 2,
    name: 'Universe AI艺术展',
    cover: '/imgs/activity/cover-4.png',
    star: 3.5,
    price: '¥128.00-¥228.00',
    location: '深圳市福田区会展中心',
    date: '2023年6月20日',
    swiper: '/imgs/activity/sicc-2021.png',
  },
  {
    id: 3,
    name: '2019 SICC服务设计创新大会',
    cover: '/imgs/activity/cover-1.png',
    star: 5,
    price: '免费活动',
    location: '深圳市腾讯滨海大厦',
    date: '2019年11月10日',
    swiper: '/imgs/activity/sicc-2019.png',
  },
  {
    id: 4,
    name: '2021 SICC服务设计创新大会',
    cover: '/imgs/activity/cover-2.png',
    star: 4.5,
    price: '¥88.00-¥228.00',
    location: '深圳市腾讯滨海大厦',
    date: '2021年3月16日',
    swiper: '/imgs/activity/sicc-2021.png',
  },
]

// 创建活动数据
activities.forEach((activity) => {
  db.activity.create(activity)
})

// 票类场次数据
const tickets = [
  { id: '1', activityId: 1, date: '2023年5月15日' },
  { id: '2', activityId: 1, date: '2023年5月16日' },
  { id: '3', activityId: 1, date: '2023年5月17日' },
  { id: '4', activityId: 2, date: '2023年6月20日' },
  { id: '5', activityId: 2, date: '2023年6月21日' },
  { id: '6', activityId: 3, date: '2019年11月10日' },
  { id: '7', activityId: 4, date: '2021年3月16日' },
  { id: '8', activityId: 4, date: '2021年3月17日' },
]

// 创建票类场次数据
tickets.forEach((ticket) => {
  db.ticket.create(ticket)
})

// 票档价格数据
const prices = [
  { id: '1', activityId: 1, description: '早鸟价-单人票', price: 98, originalPrice: 118, person: 1 },
  { id: '2', activityId: 1, description: '早鸟价-双人票', price: 178, originalPrice: 218, person: 2 },
  { id: '3', activityId: 1, description: '正价-单人票', price: 118, originalPrice: 118, person: 1 },
  { id: '4', activityId: 1, description: '正价-双人票', price: 218, originalPrice: 218, person: 2 },

  { id: '5', activityId: 2, description: '早鸟价-单人票', price: 128, originalPrice: 168, person: 1 },
  { id: '6', activityId: 2, description: '早鸟价-双人票', price: 228, originalPrice: 288, person: 2 },
  { id: '7', activityId: 2, description: '正价-单人票', price: 168, originalPrice: 168, person: 1 },
  { id: '8', activityId: 2, description: '正价-双人票', price: 288, originalPrice: 288, person: 2 },
  
  { id: '9', activityId: 3, description: '免费活动', price: 0, originalPrice: 0, person: 1 },
  
  { id: '10', activityId: 4, description: '早鸟价-单人票', price: 88, originalPrice: 128, person: 1 },
  { id: '11', activityId: 4, description: '早鸟价-双人票', price: 168, originalPrice: 228, person: 2 },
  { id: '12', activityId: 4, description: '正价-单人票', price: 128, originalPrice: 128, person: 1 },
  { id: '13', activityId: 4, description: '正价-双人票', price: 228, originalPrice: 228, person: 2 },
]

// 创建票档价格数据
prices.forEach((price) => {
  db.price.create(price)
})

function rName() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const s: number = Math.floor(Math.random() * 10) + 1
  let res = ''
  for (let i = 0; i < s; i++)
    res += chars[Math.floor(Math.random() * chars.length)]
  return res
}

for (let i = 1; i <= 5; i++) {
  db.friendList.create({
    id: i.toString(),
    name: rName(),
    avatar: `/imgs/avatar/avatar${i !== 1 ? i : ''}.png`,
  })
}

const appList = [
  { id: '1', appname: 'Doc', icon: 'imgs/icon/icon-doc.png' },
  { id: '2', appname: 'Map', icon: 'imgs/icon/icon-map.png' },
  { id: '3', appname: 'QQ', icon: 'imgs/icon/icon-qq.png' },
  { id: '4', appname: 'QQ music', icon: 'imgs/icon/icon-qqmusic.png' },
  { id: '5', appname: 'WeChat', icon: 'imgs/icon/icon-wechat.png' },
]

appList.forEach((app) => {
  db.shareAppIconList.create(app)
})
