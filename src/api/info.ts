import axios from '@/utils/request'

export function getOccupations() {
  return axios.get('/occupations')
}
