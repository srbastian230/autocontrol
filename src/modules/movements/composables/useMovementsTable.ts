import { useAutocontrolStore } from '../../autocontrol/stores/autocontrol.store'
import { exportRecordsCsv } from '../lib/exportRecordsCsv'
import type { MovementFilter } from '../models/movement.models'

const filters: { id: MovementFilter; label: string }[] = [
  { id: 'all', label: 'Todos los movimientos' },
  { id: 'sale', label: 'Ingresos (lavados)' },
  { id: 'expense', label: 'Gastos' },
]

export function useMovementsTable() {
  const store = useAutocontrolStore()

  async function removeMovement(id: string) {
    return store.deleteMovement(id)
  }

  function updatePageSize(event: Event) {
    const input = event.target
    if (input instanceof HTMLSelectElement) {
      store.setMovementPageSize(Number(input.value))
    }
  }

  function setFilter(filter: MovementFilter) {
    store.activeFilter = filter
    store.resetMovementPage()
  }

  function exportCsv() {
    exportRecordsCsv(store.filteredRecords)
  }

  return {
    store,
    filters,
    removeMovement,
    updatePageSize,
    setFilter,
    exportCsv,
  }
}
