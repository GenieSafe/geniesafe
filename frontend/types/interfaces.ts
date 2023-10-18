export interface profile {
  id: string
  email: string
  wallet_address: string
  first_name: string
  last_name: string
  ic_number?: string
}

export interface will {
  id: string
  user_id: string
  title: string
  contract_address?: string
  deployed_at_block?: string  
  status?: null | "INACTIVE" | "ACTIVE" | "VALIDATED" | "EXECUTED"
  beneficiaries: beneficiary[]
  validators: validator[]
}
export interface wallet_recovery_config {
  id: string
  user_id: string
  private_key: string
  status?: null | "INACTIVE" | "ACTIVE" | "VALIDATED" | "EXECUTED"
  verifiers: verifier[]
}

export interface beneficiary {
  id?: string
  user_id?: string
  will_id?: string
  percentage: number
  profile?: profile
}
export interface validator {
  id?: string
  user_id?: string
  will_id?: string
  has_validated: boolean
  profile?: profile
}

export interface verifier {
  id: string
  user_id: string
  config_id: string
  has_verified: boolean
  profile: profile
}

