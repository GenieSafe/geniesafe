export interface will {
  ownerUserId: string
  title: string
  walletAddress: string
  beneficiaries: beneficiary[]
  validators: validator[]
}

export interface beneficiary {
  beneficiaryUserId: string;
  percentage: number
}
export interface validator {
  validatorUserId: string
}

export interface verifier {
  verifierUserId: string
}

export interface config {
  ownerId: string
  privateKey: string
  verifiers: verifier[]
}
