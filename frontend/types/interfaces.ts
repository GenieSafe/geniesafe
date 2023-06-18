export interface Beneficiary {
  name: string
  walletAddress: string
  percentage: number
}
export interface Validator {
  name: string
  walletAddress: string
}

export interface Will {
  willTitle: string
  identityNumber: string
  walletAddress: string
  beneficiaries: Beneficiary[]
  validators: Validator[]
}