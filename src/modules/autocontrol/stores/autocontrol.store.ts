import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@supabase/supabase-js'
import { isSupabaseConfigured, supabase } from '../../../shared/lib/supabase'
import { getLocalDateString } from '../../../shared/lib/dates'
import {
  paymentFromDatabase,
  paymentToDatabase,
} from '../../../shared/lib/formatters'
import type { Business } from '../models/business.models'
import type {
  CashClosing,
  CashClosingInput,
} from '../../cash-closing/models/cashClosing.models'
import type { ExpenseForm } from '../../expenses/models/expense.models'
import type {
  MovementFilter,
  MovementRecord,
} from '../../movements/models/movement.models'
import type { SaleForm } from '../../sales/models/sale.models'

function formatErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String(error.message)
  }
  return 'error desconocido'
}

export const useAutocontrolStore = defineStore('autocontrol', () => {
  const user = ref<User | null>(null)
  const business = ref<Business | null>(null)
  const records = ref<MovementRecord[]>([])
  const closings = ref<Record<string, CashClosing>>({})
  const isInitializing = ref(true)
  const isLoadingData = ref(false)
  const authAction = ref<'signIn' | 'signUp' | null>(null)
  const isSigningOut = ref(false)
  const isSavingSale = ref(false)
  const isSavingExpense = ref(false)
  const isSavingClosing = ref(false)
  const deletingMovementId = ref<string | null>(null)
  const errorMessage = ref('')
  const statusMessage = ref('')
  const activeFilter = ref<MovementFilter>('all')
  const historyFromDate = ref('')
  const historyToDate = ref('')
  const movementPage = ref(1)
  const movementPageSize = ref(20)
  const today = getLocalDateString()
  let dataLoadPromise: Promise<boolean> | null = null
  let authSubscription: { unsubscribe: () => void } | null = null

  const isAuthenticated = computed(() => Boolean(user.value))
  const todayRecords = computed(() =>
    records.value.filter((record) => record.date === today),
  )
  const salesToday = computed(() =>
    todayRecords.value.filter((record) => record.type === 'sale'),
  )
  const expensesToday = computed(() =>
    todayRecords.value.filter((record) => record.type === 'expense'),
  )
  const totalSales = computed(() =>
    salesToday.value.reduce((total, item) => total + item.amount, 0),
  )
  const totalExpenses = computed(() =>
    expensesToday.value.reduce((total, item) => total + item.amount, 0),
  )
  const cashSales = computed(() =>
    salesToday.value
      .filter((record) => record.payment === 'Efectivo')
      .reduce((total, item) => total + item.amount, 0),
  )
  const cashExpenses = computed(() =>
    expensesToday.value
      .filter((record) => record.payment === 'Efectivo')
      .reduce((total, item) => total + item.amount, 0),
  )
  const todayClosing = computed(
    () => closings.value[today] || { opening: 0, counted: null },
  )
  const hasTodayClosing = computed(() => Boolean(closings.value[today]))
  const expectedCash = computed(
    () =>
      Number(todayClosing.value.opening || 0) +
      cashSales.value -
      cashExpenses.value,
  )
  const cashDifference = computed<number | null>(() =>
    todayClosing.value.counted === null
      ? null
      : todayClosing.value.counted - expectedCash.value,
  )
  const isDateRangeInvalid = computed(
    () =>
      Boolean(historyFromDate.value && historyToDate.value) &&
      historyFromDate.value > historyToDate.value,
  )
  const filteredRecords = computed<MovementRecord[]>(() => {
    if (isDateRangeInvalid.value) return []
    return records.value
      .filter(
        (record) =>
          (activeFilter.value === 'all' ||
            record.type === activeFilter.value) &&
          (!historyFromDate.value || record.date >= historyFromDate.value) &&
          (!historyToDate.value || record.date <= historyToDate.value),
      )
      .sort((first, second) => second.createdAt - first.createdAt)
  })
  const movementPageCount = computed(() =>
    Math.max(
      1,
      Math.ceil(filteredRecords.value.length / movementPageSize.value),
    ),
  )
  watch(filteredRecords, () => {
    if (movementPage.value > movementPageCount.value) {
      movementPage.value = movementPageCount.value
    }
  })
  const paginatedRecords = computed(() => {
    const startIndex = (movementPage.value - 1) * movementPageSize.value
    return filteredRecords.value.slice(
      startIndex,
      startIndex + movementPageSize.value,
    )
  })
  const movementRangeStart = computed(() =>
    filteredRecords.value.length === 0
      ? 0
      : (movementPage.value - 1) * movementPageSize.value + 1,
  )
  const movementRangeEnd = computed(() =>
    Math.min(
      movementPage.value * movementPageSize.value,
      filteredRecords.value.length,
    ),
  )

  function resetMovementPage() {
    movementPage.value = 1
  }

  function setMovementPage(page: number) {
    movementPage.value = Math.min(Math.max(1, page), movementPageCount.value)
  }

  function setMovementPageSize(size: number) {
    movementPageSize.value = size
    resetMovementPage()
  }

  function clearMessages() {
    errorMessage.value = ''
    statusMessage.value = ''
  }

  function setError(error: unknown, prefix: string) {
    console.error(error)
    errorMessage.value = `${prefix}: ${formatErrorMessage(error)}`
    return false
  }

  function resetWorkspace() {
    user.value = null
    business.value = null
    records.value = []
    closings.value = {}
  }

  function loadBusinessAndData(): Promise<boolean> {
    const client = supabase
    const activeUser = user.value
    if (!client || !activeUser) return Promise.resolve(false)
    if (dataLoadPromise) return dataLoadPromise
    isLoadingData.value = true

    dataLoadPromise = (async () => {
      try {
        const { data: foundBusiness, error: findError } = await client
          .from('businesses')
          .select('id, name')
          .eq('owner_id', activeUser.id)
          .maybeSingle()
        if (findError) throw findError

        let activeBusiness = foundBusiness as Business | null
        if (!activeBusiness) {
          const { data: createdBusiness, error: createError } = await client
            .from('businesses')
            .insert({ owner_id: activeUser.id, name: 'Mi Car Wash' })
            .select('id, name')
            .single()
          if (createError) throw createError
          activeBusiness = createdBusiness as Business
        }
        business.value = activeBusiness
        const businessId = activeBusiness.id

        const [salesResult, expensesResult, closingResult] = await Promise.all([
          client
            .from('sales')
            .select('*')
            .eq('business_id', businessId)
            .order('created_at', { ascending: false }),
          client
            .from('expenses')
            .select('*')
            .eq('business_id', businessId)
            .order('created_at', { ascending: false }),
          client
            .from('cash_closings')
            .select('*')
            .eq('business_id', businessId),
        ])
        if (salesResult.error) throw salesResult.error
        if (expensesResult.error) throw expensesResult.error
        if (closingResult.error) {
          if (
            closingResult.error.code === '42P01' ||
            /cash_closings/i.test(closingResult.error.message || '')
          ) {
            throw new Error(
              'Falta crear la tabla cash_closings en Supabase para usar los cierres de caja.',
            )
          }
          throw closingResult.error
        }

        const sales = (salesResult.data || []).map(
          (record): MovementRecord => ({
            id: record.id,
            type: 'sale',
            date: record.sale_date,
            amount: Number(record.amount),
            detail: `${record.service}${record.vehicle ? ` · ${record.vehicle}` : ''}`,
            payment: paymentFromDatabase(record.payment_method),
            note: record.note || '',
            createdAt: new Date(record.created_at).getTime(),
          }),
        )
        const expenses = (expensesResult.data || []).map(
          (record): MovementRecord => ({
            id: record.id,
            type: 'expense',
            date: record.expense_date,
            amount: Number(record.amount),
            detail: record.category,
            payment: paymentFromDatabase(record.payment_method),
            note: record.note || '',
            createdAt: new Date(record.created_at).getTime(),
          }),
        )

        records.value = [...sales, ...expenses].sort(
          (first, second) => second.createdAt - first.createdAt,
        )
        closings.value = Object.fromEntries(
          (closingResult.data || []).map((record) => [
            record.closing_date,
            {
              opening: Number(record.opening_cash || 0),
              counted:
                record.counted_cash === null
                  ? null
                  : Number(record.counted_cash),
            },
          ]),
        )
        return true
      } catch (error) {
        return setError(
          error,
          'No se pudieron cargar los datos. Revisa las tablas y las políticas RLS',
        )
      } finally {
        isLoadingData.value = false
        dataLoadPromise = null
      }
    })()

    return dataLoadPromise
  }

  async function initialize() {
    isInitializing.value = true
    clearMessages()
    try {
      if (!isSupabaseConfigured || !supabase) {
        errorMessage.value =
          'Configura VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY en el archivo .env.'
        return
      }

      const { data: sessionData, error } = await supabase.auth.getSession()
      if (error) {
        setError(error, 'No se pudo recuperar la sesión')
        return
      }

      if (sessionData.session?.user) {
        user.value = sessionData.session.user
        await loadBusinessAndData()
      } else {
        statusMessage.value =
          'Ingresa con el usuario que creaste en Supabase Authentication.'
      }

      authSubscription?.unsubscribe()
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          window.setTimeout(() => {
            if (session?.user) {
              user.value = session.user
              void loadBusinessAndData()
            } else {
              resetWorkspace()
            }
          }, 0)
        },
      )
      authSubscription = authListener.subscription
    } catch (error) {
      setError(error, 'No se pudo inicializar la aplicación')
    } finally {
      isInitializing.value = false
    }
  }

  async function signIn(email: string, password: string) {
    const client = supabase
    if (!client) {
      errorMessage.value = 'Configura Supabase antes de iniciar sesión.'
      return false
    }
    clearMessages()
    authAction.value = 'signIn'
    try {
      const { data, error } = await client.auth.signInWithPassword({
        email: email.trim(),
        password,
      })
      if (error) throw error
      user.value = data.user
      const loaded = await loadBusinessAndData()
      if (loaded) statusMessage.value = 'Sesión iniciada.'
      return true
    } catch (error) {
      return setError(error, 'No se pudo iniciar sesión')
    } finally {
      authAction.value = null
    }
  }

  async function signUp(email: string, password: string) {
    const client = supabase
    if (!client) {
      errorMessage.value = 'Configura Supabase antes de crear una cuenta.'
      return false
    }
    clearMessages()
    authAction.value = 'signUp'
    try {
      const { data, error } = await client.auth.signUp({
        email: email.trim(),
        password,
      })
      if (error) throw error
      if (data.session && data.user) {
        user.value = data.user
        const loaded = await loadBusinessAndData()
        if (loaded) statusMessage.value = 'Cuenta creada y sesión iniciada.'
      } else {
        statusMessage.value =
          'Cuenta creada. Revisa tu correo para confirmar la cuenta y luego inicia sesión.'
      }
      return true
    } catch (error) {
      return setError(error, 'No se pudo crear la cuenta')
    } finally {
      authAction.value = null
    }
  }

  async function signOut() {
    const client = supabase
    if (!client) return
    clearMessages()
    isSigningOut.value = true
    try {
      const { error } = await client.auth.signOut()
      if (error) {
        setError(error, 'No se pudo cerrar sesión')
        return
      }
      resetWorkspace()
      statusMessage.value = 'Sesión cerrada.'
    } catch (error) {
      setError(error, 'No se pudo cerrar sesión')
    } finally {
      isSigningOut.value = false
    }
  }

  async function saveSale(form: SaleForm) {
    const client = supabase
    const activeBusiness = business.value
    if (!client || !user.value || !activeBusiness) {
      errorMessage.value = 'Inicia sesión antes de registrar una venta.'
      return false
    }
    clearMessages()
    isSavingSale.value = true
    try {
      const { error } = await client.from('sales').insert({
        business_id: activeBusiness.id,
        sale_date: form.date,
        amount: Number(form.amount),
        service: form.service,
        vehicle: form.vehicle || null,
        payment_method: paymentToDatabase(form.payment),
        note: form.note.trim() || null,
      })
      if (error) throw error
      resetMovementPage()
      const refreshed = await loadBusinessAndData()
      statusMessage.value = refreshed
        ? 'Venta guardada.'
        : 'Venta registrada, pero no se pudo actualizar la lista. Recarga para verificar los datos.'
      return true
    } catch (error) {
      return setError(error, 'No se pudo guardar la venta')
    } finally {
      isSavingSale.value = false
    }
  }

  async function saveExpense(form: ExpenseForm) {
    const client = supabase
    const activeBusiness = business.value
    if (!client || !user.value || !activeBusiness) {
      errorMessage.value = 'Inicia sesión antes de registrar un gasto.'
      return false
    }
    clearMessages()
    isSavingExpense.value = true
    try {
      const { error } = await client.from('expenses').insert({
        business_id: activeBusiness.id,
        expense_date: form.date,
        amount: Number(form.amount),
        category: form.category,
        payment_method: paymentToDatabase(form.payment),
        note: form.note.trim() || null,
      })
      if (error) throw error
      resetMovementPage()
      const refreshed = await loadBusinessAndData()
      statusMessage.value = refreshed
        ? 'Gasto guardado.'
        : 'Gasto registrado, pero no se pudo actualizar la lista. Recarga para verificar los datos.'
      return true
    } catch (error) {
      return setError(error, 'No se pudo guardar el gasto')
    } finally {
      isSavingExpense.value = false
    }
  }

  async function saveClosing({ opening, counted }: CashClosingInput) {
    const client = supabase
    const activeBusiness = business.value
    if (!client || !user.value || !activeBusiness) {
      errorMessage.value = 'Inicia sesión antes de guardar el cierre.'
      return false
    }
    const openingAmount = Number(opening || 0)
    const countedAmount = counted === '' ? null : Number(counted)
    if (openingAmount < 0 || (countedAmount !== null && countedAmount < 0)) {
      errorMessage.value = 'Los importes no pueden ser negativos.'
      return false
    }
    clearMessages()
    isSavingClosing.value = true
    try {
      const { error } = await client.from('cash_closings').upsert(
        {
          business_id: activeBusiness.id,
          closing_date: today,
          opening_cash: openingAmount,
          counted_cash: countedAmount,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'business_id,closing_date' },
      )
      if (error) throw error
      const refreshed = await loadBusinessAndData()
      statusMessage.value = refreshed
        ? 'Cierre de caja guardado.'
        : 'Cierre guardado, pero no se pudo actualizar la vista. Recarga para verificar los datos.'
      return true
    } catch (error) {
      return setError(error, 'No se pudo guardar el cierre')
    } finally {
      isSavingClosing.value = false
    }
  }

  async function deleteMovement(id: string) {
    const record = records.value.find((item) => item.id === id)
    const client = supabase
    const activeBusiness = business.value
    if (!client || !activeBusiness || !record) return false
    clearMessages()
    deletingMovementId.value = id
    try {
      const table = record.type === 'sale' ? 'sales' : 'expenses'
      const { error } = await client
        .from(table)
        .delete()
        .eq('id', id)
        .eq('business_id', activeBusiness.id)
      if (error) throw error
      const refreshed = await loadBusinessAndData()
      statusMessage.value = refreshed
        ? 'Movimiento eliminado.'
        : 'Movimiento eliminado, pero no se pudo actualizar la lista. Recarga para verificar los datos.'
      return true
    } catch (error) {
      return setError(error, 'No se pudo eliminar el movimiento')
    } finally {
      deletingMovementId.value = null
    }
  }

  return {
    user,
    business,
    records,
    isInitializing,
    isLoadingData,
    authAction,
    isSigningOut,
    isSavingSale,
    isSavingExpense,
    isSavingClosing,
    deletingMovementId,
    errorMessage,
    statusMessage,
    activeFilter,
    historyFromDate,
    historyToDate,
    isDateRangeInvalid,
    movementPage,
    movementPageSize,
    filteredRecords,
    paginatedRecords,
    movementPageCount,
    movementRangeStart,
    movementRangeEnd,
    isAuthenticated,
    totalSales,
    totalExpenses,
    salesToday,
    expensesToday,
    cashSales,
    cashExpenses,
    todayClosing,
    hasTodayClosing,
    expectedCash,
    cashDifference,
    initialize,
    signIn,
    signUp,
    signOut,
    saveSale,
    saveExpense,
    saveClosing,
    deleteMovement,
    resetMovementPage,
    setMovementPage,
    setMovementPageSize,
    clearMessages,
  }
})
