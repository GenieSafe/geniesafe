export interface User {
  id: string
  email: string
  walletAddress: string
  firstName: string
  lastName: string
}

export interface Will {
  id?: string
  ownerUserId: string
  title: string
  deployedAtBlock: string
  isActive: boolean
  isValidated: boolean
  Beneficiaries: Beneficiary[]
  Validators: Validator[]
}

export interface Beneficiary {
  beneficiaryUserId: string;
  percentage: number
  User?: User
}
export interface Validator {
  validatorUserId: string
  isValidated: boolean
  User?: User
}

export interface Verifier {
  verifierUserId: string
}

export interface Config {
  ownerId: string
  privateKey: string
  verifiers: object[]
}
