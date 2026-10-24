<script setup lang="ts">
import { ref } from 'vue'
import { formatMoney } from '../../../shared/lib/formatters'
import { useMovementsTable } from '../composables/useMovementsTable'

const { store, filters, removeMovement, updatePageSize, setFilter, exportCsv } =
  useMovementsTable()
const deleteDialog = ref<HTMLDialogElement | null>(null)
const movementToDelete = ref<string | null>(null)

function requestDeleteMovement(id: string) {
  movementToDelete.value = id
  deleteDialog.value?.showModal()
}

function cancelDeleteMovement() {
  deleteDialog.value?.close()
}

async function confirmDeleteMovement() {
  if (!movementToDelete.value) return
  const deleted = await removeMovement(movementToDelete.value)
  if (deleted) deleteDialog.value?.close()
}
</script>

<template>
  <div
    class="my-4 flex flex-wrap gap-2"
    aria-label="Filtrar movimientos"
  >
    <button
      v-for="filter in filters"
      :key="filter.id"
      type="button"
      class="flex-1 rounded-lg border px-3 py-2 text-xs font-extrabold transition sm:flex-none"
      :class="
        store.activeFilter === filter.id
          ? 'border-accent bg-accent text-[#092018]'
          : 'border-line text-muted hover:text-copy bg-[#121c28]'
      "
      :aria-pressed="store.activeFilter === filter.id"
      @click="setFilter(filter.id)"
    >
      {{ filter.label }}
    </button>
  </div>
  <section class="panel-card">
    <div class="mb-3 flex flex-wrap items-center justify-between gap-3">
      <div class="min-w-0">
        <h2 class="section-title mb-1">Ingresos y gastos</h2>
        <p class="text-muted text-[13px]">
          Filtra el historial y descarga el resultado.
        </p>
      </div>
      <div class="grid w-full grid-cols-1 gap-2 sm:w-auto sm:grid-cols-2">
        <label
          for="history-from-date"
          class="field-label"
        >
          Desde
          <input
            id="history-from-date"
            v-model="store.historyFromDate"
            class="form-control"
            type="date"
            @change="store.resetMovementPage()"
          />
        </label>
        <label
          for="history-to-date"
          class="field-label"
        >
          Hasta
          <input
            id="history-to-date"
            v-model="store.historyToDate"
            class="form-control"
            type="date"
            @change="store.resetMovementPage()"
          />
        </label>
        <button
          class="button-secondary w-full sm:col-span-2"
          type="button"
          :disabled="store.isLoadingData || store.filteredRecords.length === 0"
          @click="exportCsv"
        >
          Descargar {{ store.filteredRecords.length }} registro(s) CSV
        </button>
      </div>
    </div>
    <p
      v-if="store.isDateRangeInvalid"
      class="text-warning mb-3 text-sm"
      role="alert"
    >
      La fecha «Desde» debe ser anterior o igual a «Hasta».
    </p>
    <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
      <p
        class="text-muted text-xs"
        aria-live="polite"
      >
        {{
          store.filteredRecords.length === 0
            ? '0 registros'
            : `Mostrando ${store.movementRangeStart}–${store.movementRangeEnd} de ${store.filteredRecords.length}`
        }}
      </p>
      <label class="field-label flex-row items-center gap-2">
        Por página
        <select
          :value="store.movementPageSize"
          class="form-control w-auto"
          @change="updatePageSize"
        >
          <option :value="10">10</option>
          <option :value="20">20</option>
          <option :value="50">50</option>
        </select>
      </label>
    </div>
    <p
      v-if="store.isLoadingData"
      class="text-muted mb-3 text-xs"
      role="status"
    >
      Actualizando movimientos…
    </p>
    <ul class="space-y-2 sm:hidden">
      <li
        v-for="record in store.paginatedRecords"
        :key="`mobile-${record.type}-${record.id}`"
        class="border-line rounded-xl border bg-[#0d151e] p-3"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <span
              class="rounded-full px-2 py-1 text-[11px]"
              :class="
                record.type === 'sale'
                  ? 'text-accent-soft bg-[#1e3b37]'
                  : 'bg-[#3c2929] text-[#ffb4b4]'
              "
            >
              {{ record.type === 'sale' ? 'Venta' : 'Gasto' }}
            </span>
            <p class="mt-2 text-sm font-bold break-words">
              {{ record.detail }}
            </p>
            <p
              v-if="record.note"
              class="text-muted mt-1 text-xs break-words"
            >
              {{ record.note }}
            </p>
          </div>
          <strong class="shrink-0 text-sm">
            {{ formatMoney(record.amount) }}
          </strong>
        </div>
        <div
          class="text-muted mt-3 flex items-center justify-between gap-3 text-xs"
        >
          <span>{{ record.date }} · {{ record.payment }}</span>
          <button
            class="button-danger"
            type="button"
            :disabled="store.deletingMovementId !== null || store.isLoadingData"
            :aria-busy="store.deletingMovementId === record.id"
            @click="requestDeleteMovement(record.id)"
          >
            {{
              store.deletingMovementId === record.id
                ? 'Eliminando…'
                : 'Eliminar'
            }}
          </button>
        </div>
      </li>
    </ul>
    <div class="border-line hidden overflow-x-auto rounded-xl border sm:block">
      <table
        class="w-full min-w-[650px] border-collapse bg-[#0f1822] text-left text-[13px]"
      >
        <thead
          class="text-muted bg-[#141f2b] text-[11px] tracking-wider uppercase"
        >
          <tr>
            <th class="px-3 py-3">Tipo</th>
            <th class="px-3 py-3">Detalle</th>
            <th class="px-3 py-3">Pago</th>
            <th class="px-3 py-3">Fecha</th>
            <th class="px-3 py-3">Importe</th>
            <th class="px-3 py-3"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="record in store.paginatedRecords"
            :key="`${record.type}-${record.id}`"
            class="border-t border-[#233142]"
          >
            <td class="px-3 py-3">
              <span
                class="rounded-full px-2 py-1 text-[11px]"
                :class="
                  record.type === 'sale'
                    ? 'text-accent-soft bg-[#1e3b37]'
                    : 'bg-[#3c2929] text-[#ffb4b4]'
                "
              >
                {{ record.type === 'sale' ? 'Venta' : 'Gasto' }}
              </span>
            </td>
            <td class="px-3 py-3">
              <strong>{{ record.detail }}</strong>
              <p
                v-if="record.note"
                class="text-muted mt-1 text-[11px]"
              >
                {{ record.note }}
              </p>
            </td>
            <td class="px-3 py-3">{{ record.payment }}</td>
            <td class="px-3 py-3">{{ record.date }}</td>
            <td class="px-3 py-3 font-extrabold whitespace-nowrap">
              {{ formatMoney(record.amount) }}
            </td>
            <td class="px-3 py-3">
              <button
                class="button-danger"
                type="button"
                aria-label="Eliminar movimiento"
                :disabled="
                  store.deletingMovementId !== null || store.isLoadingData
                "
                :aria-busy="store.deletingMovementId === record.id"
                @click="requestDeleteMovement(record.id)"
              >
                {{
                  store.deletingMovementId === record.id
                    ? 'Eliminando…'
                    : 'Eliminar'
                }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p
      v-if="
        !store.isLoadingData &&
        !store.isDateRangeInvalid &&
        store.filteredRecords.length === 0
      "
      class="text-muted p-7 text-center text-sm"
    >
      Todavía no hay movimientos. Registra tu primera venta o gasto.
    </p>
    <nav
      v-if="store.movementPageCount > 1"
      class="mt-4 flex flex-wrap items-center justify-between gap-3"
      aria-label="Paginación de movimientos"
    >
      <button
        class="button-secondary"
        type="button"
        :disabled="store.movementPage === 1"
        @click="store.setMovementPage(store.movementPage - 1)"
      >
        Anterior
      </button>
      <p
        class="text-muted text-xs"
        aria-live="polite"
      >
        Página {{ store.movementPage }} de {{ store.movementPageCount }}
      </p>
      <button
        class="button-secondary"
        type="button"
        :disabled="store.movementPage === store.movementPageCount"
        @click="store.setMovementPage(store.movementPage + 1)"
      >
        Siguiente
      </button>
    </nav>
    <dialog
      ref="deleteDialog"
      class="border-line bg-panel text-copy m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border p-0 shadow-2xl backdrop:bg-black/70"
      aria-labelledby="delete-movement-title"
      @close="movementToDelete = null"
    >
      <div class="p-5 sm:p-6">
        <h2
          id="delete-movement-title"
          class="text-lg font-bold"
        >
          ¿Está seguro de querer eliminar este registro?
        </h2>
        <p class="text-muted mt-2 text-sm leading-6">
          Esta acción no se puede deshacer.
        </p>
        <div
          class="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"
        >
          <button
            class="button-secondary w-full sm:w-auto"
            type="button"
            :disabled="store.deletingMovementId !== null"
            @click="cancelDeleteMovement"
          >
            Cancelar
          </button>
          <button
            class="button-danger w-full sm:w-auto"
            type="button"
            :disabled="store.deletingMovementId !== null || store.isLoadingData"
            :aria-busy="store.deletingMovementId !== null"
            @click="confirmDeleteMovement"
          >
            {{ store.deletingMovementId !== null ? 'Eliminando…' : 'Eliminar' }}
          </button>
        </div>
      </div>
    </dialog>
  </section>
</template>
