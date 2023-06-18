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
  ownerUserId: string
  title: string
  walletAddress: string
  beneficiaries: Beneficiary[]
  validators: Validator[]
}

export interface Verifier {
  verifierUserId: string
}

export interface Config {
  ownerId: string
  privateKey: string
  verifiers: Verifier[]
}