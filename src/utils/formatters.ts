export function formatPrice(minPrice: number, maxPrice: number): string {
  if (minPrice === 0 && maxPrice === 0)
    return '免费活动'
  if (minPrice === maxPrice)
    return `¥${minPrice.toFixed(2)}`
  return `¥${minPrice.toFixed(2)}-¥${maxPrice.toFixed(2)}`
}

export function formatCityName(name: string) {
  if (name.endsWith('市'))
    return name.slice(0, -1)
  return name
}

export function formatDateRange(dateRange: Date[]) {
  const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return [year, month, day]
  }
  const [startYear, startMonth, startDay] = formatDate(dateRange[0])
  if (dateRange.length === 1)
    return `${startYear}年${startMonth}月${startDay}日`
  const [endYear, endMonth, endDay] = formatDate(dateRange[1])
  if (startYear === endYear)
    return `${startYear}年${startMonth}月${startDay}日-${endMonth}月${endDay}日`
  return `${startYear}年${startMonth}月${startDay}日-${endYear}年${endMonth}月${endDay}日`
}
