import { reactive } from 'vue'
import { getLocalDateString } from '../../../shared/lib/dates'
import { useAutocontrolStore } from '../../autocontrol/stores/autocontrol.store'
import type { ExpenseCategory, ExpenseForm } from '../models/expense.models'

interface ExpenseFormValues extends Omit<ExpenseForm, 'amount' | 'category'> {
  amount: string
  category: ExpenseCategory | ''
}

const categories = [
  'Productos de limpieza',
  'Paños y materiales',
  'Servicios básicos',
  'Mantenimiento',
  'Pago de personal',
  'Alquiler',
  'Otros',
] satisfies ExpenseCategory[]

const payments = [
  'Efectivo',
  'Yape',
  'Plin',
  'Tarjeta',
  'Transferencia',
  'Otro',
] satisfies ExpenseForm['payment'][]

function createInitialForm(): ExpenseFormValues {
  return {
    date: getLocalDateString(),
    amount: '',
    category: '',
    payment: 'Efectivo',
    note: '',
  }
}

export function useExpenseForm() {
  const store = useAutocontrolStore()
  const form = reactive<ExpenseFormValues>(createInitialForm())

  async function submit() {
    if (!form.category) return false
    const expense: ExpenseForm = { ...form, category: form.category }
    if (!(await store.saveExpense(expense))) return false
    Object.assign(form, createInitialForm())
    return true
  }

  return { store, form, categories, payments, submit }
}
