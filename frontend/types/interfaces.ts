export interface Will {
  ownerUserId: string
  title: string
  walletAddress: string
  beneficiaries: Beneficiary[]
  validators: Validator[]
}

export interface Beneficiary {
  beneficiaryUserId: string;
  percentage: number
}
export interface Validator {
  validatorUserId: string
}

export interface Verifier {
  verifierUserId: string
}

export interface Config {
  ownerId: string
  privateKey: string
  verifiers: object[]
}
