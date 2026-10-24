import type { PaymentMethod } from '../../../shared/models/payment.models'

export type SaleService =
  | 'Lavado básico'
  | 'Lavado premium'
  | 'Lavado de camioneta'
  | 'Aspirado'
  | 'Encerado'
  | 'Detailing interior'
  | 'Pulido'
  | 'Otro'

export type VehicleType = 'Auto' | 'Camioneta' | 'SUV' | 'Moto' | 'Otro'

export interface SaleForm {
  date: string
  amount: number | string
  service: SaleService
  vehicle: VehicleType
  payment: PaymentMethod
  note: string
}
