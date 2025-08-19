// 人员信息接口
interface Person {
  id: string;
  name: string;
  birthday?: string;
  phone?: string;
  idCard?: string;
  email?: string;
  profession?: string;
  isDefault: boolean;
}

// 初始化人员数据
function initPersons() {
  const storedPersons = localStorage.getItem('userPersons')
  if (storedPersons) {
    return JSON.parse(storedPersons)
  }
  // 默认添加一个人员
  return [
    {
      id: '1',
      name: '蔡宣轩',
      isDefault: true
    }
  ]
}

// 初始化选中的人员ID
function initSelectedPersonIds() {
  const storedSelectedIds = localStorage.getItem('userSelectedPersonIds')
  if (storedSelectedIds) {
    return JSON.parse(storedSelectedIds)
  }
  // 默认选中第一个人员
  return ['1']
}

const userInfo = reactive({
  locationName: localStorage.getItem('userLocationName') || '深圳市',
  persons: initPersons(),
  selectedPersonIds: initSelectedPersonIds(),

  // 添加人员
  addPerson(person) {
    // 生成唯一ID
    const id = Date.now().toString()
    
    // 如果设置为默认，则将其他人员的默认状态设为false
    if (person.isDefault) {
      this.persons.forEach(p => {
        p.isDefault = false
      })
    }
    
    // 添加新人员
    this.persons.push({
      id,
      ...person
    })
  },

  // 获取默认人员
  getDefaultPerson() {
    return this.persons.find(p => p.isDefault)
  }
})

// 监听人员信息变化，保存到localStorage
watch(
  () => JSON.stringify(userInfo.persons),
  (newPersons) => {
    localStorage.setItem('userPersons', newPersons)
  },
  {
    immediate: true,
  }
)

// 监听选中的人员ID变化，保存到localStorage
watch(
  () => JSON.stringify(userInfo.selectedPersonIds),
  (newSelectedIds) => {
    localStorage.setItem('userSelectedPersonIds', newSelectedIds)
  },
  {
    immediate: true,
  }
)

// 监听位置名称变化，保存到localStorage
watch(
  () => userInfo.locationName,
  (newLocationName) => {
    localStorage.setItem('userLocationName', newLocationName)
  },
  {
    immediate: true,
  }
)

export default userInfo
