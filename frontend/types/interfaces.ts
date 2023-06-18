export interface Beneficiary {
  name: string
  beneficiaryUserId: string
  walletAddress: string
  percentage: number
}
export interface Validator {
  name: string
  validatorUserId: string
  walletAddress: string
}

export interface Will {
  ownerUserId: string
  title: string
  walletAddress: string
  beneficiaries: Beneficiary[]
  validators: Validator[]
}
