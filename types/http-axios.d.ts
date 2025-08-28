import 'axios'
import type { ErrorToastOption } from '@/utils/http/types'

declare module 'axios' {
  interface AxiosRequestConfig {
    errorToast?: ErrorToastOption
  }
}
