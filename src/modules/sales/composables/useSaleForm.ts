import { reactive } from 'vue'
import { getLocalDateString } from '../../../shared/lib/dates'
import { useAutocontrolStore } from '../../autocontrol/stores/autocontrol.store'
import type { SaleForm } from '../models/sale.models'

interface SaleFormValues extends Omit<SaleForm, 'amount' | 'service'> {
  amount: string
  service: SaleForm['service'] | ''
}

const services = [
  'Lavado básico',
  'Lavado premium',
  'Lavado de camioneta',
  'Aspirado',
  'Encerado',
  'Detailing interior',
  'Pulido',
  'Otro',
] satisfies SaleForm['service'][]

const vehicles = [
  'Auto',
  'Camioneta',
  'SUV',
  'Moto',
  'Otro',
] satisfies SaleForm['vehicle'][]

const payments = [
  'Efectivo',
  'Yape',
  'Plin',
  'Tarjeta',
  'Transferencia',
  'Otro',
] satisfies SaleForm['payment'][]

function createInitialForm(): SaleFormValues {
  return {
    date: getLocalDateString(),
    amount: '',
    service: '',
    vehicle: 'Auto',
    payment: 'Efectivo',
    note: '',
  }
}

export function useSaleForm() {
  const store = useAutocontrolStore()
  const form = reactive<SaleFormValues>(createInitialForm())

  async function submit() {
    if (!form.service) return false
    const sale: SaleForm = { ...form, service: form.service }
    if (!(await store.saveSale(sale))) return false
    Object.assign(form, createInitialForm())
    return true
  }

  return { store, form, services, vehicles, payments, submit }
}
