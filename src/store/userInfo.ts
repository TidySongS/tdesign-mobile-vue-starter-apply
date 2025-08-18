const userInfo = reactive({
  locationName: localStorage.getItem('userLocationName') || '深圳市',
})

watch(
  () => userInfo.locationName,
  (newLocationName) => {
    localStorage.setItem('userLocationName', newLocationName)
  },
  {
    immediate: true,
  },
)

export default userInfo
