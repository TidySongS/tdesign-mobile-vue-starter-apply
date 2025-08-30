// import axios from 'axios'
export interface ValidationResultItem {
  valid: boolean
  message?: string
}

export interface FieldValidationResult {
  [fieldName: string]: ValidationResultItem[]
}

export type ValidateResult = true | FieldValidationResult

export interface personFormData {
  name: string
  birthday: string
  phone: string
  idCard: string
  email: string
  profession: string
  isDefault: string
}

// export function submitUserInfoForm(data: personFormData) {
//  return axios.post('/personinfo', data)
// }
