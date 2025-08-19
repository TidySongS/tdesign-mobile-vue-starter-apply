import { fakerZH_CN as faker } from '@faker-js/faker'
import { factory, manyOf, primaryKey } from '@mswjs/data'
import dayjs from 'dayjs'
import { defaultFilterOptions } from '@/constant/filters'
import { covers } from './activityMocks'

const twoYearsFromNow = dayjs().add(2, 'year').toDate()

function generatePrice() {
  const priceType = faker.helpers.arrayElement(['free', 'single', 'range'])

  if (priceType === 'free') {
    return { minPrice: 0, maxPrice: 0, priceType }
  }
  else if (priceType === 'single') {
    const singlePrice = faker.number.int({
      min: defaultFilterOptions.priceRange[0],
      max: defaultFilterOptions.priceRange[1],
    })
    return { minPrice: singlePrice, maxPrice: singlePrice, priceType }
  }
  else {
    const min = faker.number.int({
      min: defaultFilterOptions.priceRange[0],
      max: defaultFilterOptions.priceRange[1] / 2,
    })
    const max = faker.number.int({
      min,
      max: defaultFilterOptions.priceRange[1],
    })
    return { minPrice: min, maxPrice: max, priceType }
  }
}

// 生成票类场次数据
function generateTickets(activityId: string) {
  const ticketCount = faker.number.int({ min: 1, max: 5 })
  const tickets = []
  
  for (let i = 0; i < ticketCount; i++) {
    tickets.push({
      id: faker.string.uuid(),
      activityId,
      date: faker.date.between({ 
        from: new Date(), 
        to: dayjs().add(1, 'year').toDate() 
      }).toLocaleDateString('zh-CN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    })
  }
  
  return tickets
}

// 生成票档价格数据
function generatePrices(activityId: string, minPrice: number, maxPrice: number, priceType: string) {
  const prices = []
  
  if (priceType === 'free') {
    prices.push({
      id: faker.string.uuid(),
      activityId,
      description: '免费活动',
      price: 0,
      originalPrice: 0,
      person: 1
    })
  } else if (priceType === 'single') {
    // 早鸟价
    const earlyBirdPrice = Math.max(0, minPrice - faker.number.int({ min: 5, max: 20 }))
    prices.push({
      id: faker.string.uuid(),
      activityId,
      description: '早鸟价-单人票',
      price: earlyBirdPrice,
      originalPrice: minPrice,
      person: 1
    })
    
    // 正价
    prices.push({
      id: faker.string.uuid(),
      activityId,
      description: '正价-单人票',
      price: minPrice,
      originalPrice: minPrice,
      person: 1
    })
    
    // 双人票早鸟价
    const duoEarlyBirdPrice = Math.max(0, minPrice * 2 - faker.number.int({ min: 10, max: 40 }))
    prices.push({
      id: faker.string.uuid(),
      activityId,
      description: '早鸟价-双人票',
      price: duoEarlyBirdPrice,
      originalPrice: minPrice * 2,
      person: 2
    })

    // 双人票正价
    prices.push({
      id: faker.string.uuid(),
      activityId,
      description: '正价-双人票',
      price: minPrice * 2,
      originalPrice: minPrice * 2,
      person: 2
    })
  } else {
    // 早鸟价-最低价
    const earlyBirdMinPrice = Math.max(0, minPrice - faker.number.int({ min: 5, max: 20 }))
    prices.push({
      id: faker.string.uuid(),
      activityId,
      description: '早鸟价-单人票',
      price: earlyBirdMinPrice,
      originalPrice: minPrice,
      person: 1
    })
    
    // 正价-最低价
    prices.push({
      id: faker.string.uuid(),
      activityId,
      description: '正价-单人票',
      price: minPrice,
      originalPrice: minPrice,
      person: 1
    })
    
    // 早鸟价-最高价
    const earlyBirdMaxPrice = Math.max(0, maxPrice - faker.number.int({ min: 5, max: 20 }))
    prices.push({
      id: faker.string.uuid(),
      activityId,
      description: '早鸟价-单人票(高价)',
      price: earlyBirdMaxPrice,
      originalPrice: maxPrice,
      person: 1
    })
    
    // 正价-最高价
    prices.push({
      id: faker.string.uuid(),
      activityId,
      description: '正价-单人票(高价)',
      price: maxPrice,
      originalPrice: maxPrice,
      person: 1
    })
  }
  
  return prices
}

export const db = factory({
  activity: {
    id: primaryKey(faker.string.uuid), // 主键 ID
    title: () => `${faker.company.name()}活动`,
    cover: () => faker.helpers.arrayElement(covers),
    score: () => faker.number.float({ min: 0, max: 5, multipleOf: 0.5 }),
    minPrice: () =>
      faker.number.int({
        min: defaultFilterOptions.priceRange[0],
        max: defaultFilterOptions.priceRange[1] / 2,
      }),
    maxPrice: () =>
      faker.number.int({
        min: defaultFilterOptions.priceRange[1] / 2,
        max: defaultFilterOptions.priceRange[1],
      }),
    domain: () => faker.helpers.arrayElement(defaultFilterOptions.domain),
    type: () => faker.helpers.arrayElement(defaultFilterOptions.type),
    date: () => faker.date.between({ from: new Date(), to: twoYearsFromNow }), // 未来两年
    address: () => faker.location.streetAddress(),
    introduce: () => faker.lorem.paragraphs(1),
    comments: manyOf('comment'), // 嵌套评论
    interestedPeople: manyOf('interestedPerson'), // 嵌套感兴趣的人
  },
  // 独立的评论模型
  comment: {
    id: primaryKey(faker.string.uuid),
    user: () => faker.person.fullName(),
    rating: () => faker.number.int({ min: 1, max: 5 }),
    content: () => faker.lorem.sentence(),
  },

  // 独立的感兴趣的人模型
  interestedPerson: {
    id: primaryKey(faker.string.uuid),
    name: () => faker.person.fullName(),
    avatar: () => faker.image.avatar(),
  },
  personActivity: {
    id: primaryKey(faker.string.uuid), // 主键 ID
    personId: () => faker.string.uuid(), // 个人 ID
    title: () => `${faker.company.name()}活动`, // 活动标题
    status: () => faker.helpers.arrayElement(['已完成', '待参加']),
    date: () => faker.date.between({ from: new Date(), to: twoYearsFromNow }), // 未来两年
  },
  // 职业
  occupation: {
    id: primaryKey(faker.string.uuid),
    title: () => faker.person.jobTitle(),
  },

  friendList: {
    id: primaryKey(faker.string.uuid),
    name: () => faker.person.fullName(),
    avatar: () => faker.image.avatar(),
  },

  ticket: {
    id: primaryKey(faker.string.uuid),
    activityId: String,
    date: String,
  },
  price: {
    id: primaryKey(faker.string.uuid),
    activityId: String,
    description: String,
    price: Number,
    originalPrice: Number,
    person: Number,
  },
  shareAppIconList: {
    id: primaryKey(String),
    appname: String,
    icon: String,
  },
})

const comments = Array.from({ length: 66 })
  .fill(null)
  .map(() => db.comment.create())
const interestedPeople = Array.from({ length: 66 })
  .fill(null)
  .map(() => db.interestedPerson.create())

Array.from({ length: 5 })
  .fill(null)
  .map(() => db.friendList.create())

// 预生成一些假数据
for (let i = 0; i < 100; i++) {
  const priceInfo = generatePrice()
  const activity = db.activity.create({ ...priceInfo, comments, interestedPeople })
  
  // 为每个活动生成票类场次数据
  const activityTickets = generateTickets(activity.id)
  activityTickets.forEach((ticket) => {
    db.ticket.create(ticket)
  })
  
  // 为每个活动生成票档价格数据
  const activityPrices = generatePrices(activity.id, activity.minPrice, activity.maxPrice, priceInfo.priceType)
  activityPrices.forEach((price) => {
    db.price.create(price)
  })
}

for (let i = 0; i < 20; i++) {
  db.personActivity.create()
}

for (let i = 0; i < 20; i++) {
  db.occupation.create()
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
