import { fakerZH_CN as faker } from '@faker-js/faker'
import { factory, manyOf, primaryKey } from '@mswjs/data'
import dayjs from 'dayjs'

const twoYearsFromNow = dayjs().add(2, 'year').toDate()

export const db = factory({
  activity: {
    id: primaryKey(faker.string.uuid), // 主键 ID
    title: () => `${faker.company.name()}活动`, // 活动标题
    score: () => faker.number.int({ min: 0, max: 5 }), // 活动得分
    minPrice: () => faker.number.int({ min: 50, max: 200 }), // 活动最低价
    maxPrice: () => faker.number.int({ min: 200, max: 1000 }), // 活动最高价
    isHighScore: () => false,
    domain: () => faker.helpers.arrayElement(['IT互联网', '艺术设计', '科技', '电商', '教育', '医疗健康', '心理学', '摄影']),
    type: () => faker.helpers.arrayElement(['讲座', '展览', '工作坊']),
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
})

const comments = Array.from({ length: 66 }).fill(null).map(() => db.comment.create())
const interestedPeople = Array.from({ length: 66 }).fill(null).map(() => db.interestedPerson.create())

// 预生成一些假数据
for (let i = 0; i < 100; i++) {
  db.activity.create({ comments, interestedPeople })
}

for (let i = 0; i < 20; i++) {
  db.personActivity.create()
}

for (let i = 0; i < 20; i++) {
  db.occupation.create()
}
