import { faker } from '@faker-js/faker'
import { factory, primaryKey } from '@mswjs/data'

export const db = factory({
  user: {
    id: primaryKey(faker.string.uuid),
    name: () => faker.person.fullName(),
    email: () => faker.internet.email(),
  },
})

// 预生成一些假数据
for (let i = 0; i < 10; i++) {
  db.user.create()
}
