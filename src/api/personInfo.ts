export interface ValidationResultItem {
  valid: boolean
  message?: string
}

export interface FieldValidationResult {
  [fieldName: string]: ValidationResultItem[]
}

export type ValidateResult = true | FieldValidationResult
