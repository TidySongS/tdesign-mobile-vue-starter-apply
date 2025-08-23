import axios from '@/utils/request'

/**
 * 获取朋友列表
 * @returns 朋友列
 */
export function getFriendList() {
  return axios.get('/share/friends')
}

/**
 * 获取社交媒体应用列表
 * @returns 应用列表
 */
export function getAppList() {
  return axios.get('/share/app')
}
