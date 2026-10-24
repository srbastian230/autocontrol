import type {
  DatabasePaymentMethod,
  PaymentMethod,
} from '../models/payment.models'

export function formatMoney(amount: number): string {
  return `S/ ${Number(amount || 0).toLocaleString('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

const paymentMethods: Record<PaymentMethod, DatabasePaymentMethod> = {
  Efectivo: 'cash',
  Yape: 'yape',
  Plin: 'plin',
  Tarjeta: 'card',
  Transferencia: 'transfer',
  Otro: 'other',
}

const paymentLabels: Record<DatabasePaymentMethod, PaymentMethod> = {
  cash: 'Efectivo',
  yape: 'Yape',
  plin: 'Plin',
  card: 'Tarjeta',
  transfer: 'Transferencia',
  other: 'Otro',
}

function isDatabasePaymentMethod(
  value: string,
): value is DatabasePaymentMethod {
  return Object.hasOwn(paymentLabels, value)
}

export function paymentToDatabase(label: PaymentMethod): DatabasePaymentMethod {
  return paymentMethods[label] || 'other'
}

export function paymentFromDatabase(value: string): PaymentMethod {
  return isDatabasePaymentMethod(value) ? paymentLabels[value] : 'Otro'
}
