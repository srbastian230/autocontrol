import type { PaymentMethod } from '../../../shared/models/payment.models'

export type MovementType = 'sale' | 'expense'
export type MovementFilter = 'all' | MovementType

export interface MovementRecord {
  id: string
  type: MovementType
  date: string
  amount: number
  detail: string
  payment: PaymentMethod
  note: string
  createdAt: number
}
