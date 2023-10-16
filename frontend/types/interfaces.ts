export interface user {
  id: string
  email: string
  walletAddress: string
  firstName: string
  lastName: string
}

export interface will {
  id?: string
  ownerUserId: string
  title: string
  deployedAtBlock: string
  isActive: boolean
  isValidated: boolean
  beneficiaries: beneficiary[]
  validators: validator[]
}

export interface beneficiary {
  beneficiaryUserId: string
  percentage: number
  user?: user
}
export interface validator {
  validatorUserId: string
  isValidated: boolean
  user?: user
}

export interface verifier {
  verifierUserId: string
}

export interface config {
  ownerId: string
  privateKey: string
  verifiers: verifier[]
}
