import type { PaymentMethod } from '../../../shared/models/payment.models'

export type ExpenseCategory =
  | 'Productos de limpieza'
  | 'Paños y materiales'
  | 'Servicios básicos'
  | 'Mantenimiento'
  | 'Pago de personal'
  | 'Alquiler'
  | 'Otros'

export interface ExpenseForm {
  date: string
  amount: number | string
  category: ExpenseCategory
  payment: PaymentMethod
  note: string
}
