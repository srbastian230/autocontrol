<script setup lang="ts">
import { formatMoney } from '../../../shared/lib/formatters'
import { useCashClosing } from '../composables/useCashClosing'

const { store, opening, counted, isEditingOpening, toggleOpeningEdit, save } =
  useCashClosing()
</script>

<template>
  <section class="panel-card">
    <h2 class="section-title">Cierre de caja</h2>
    <p class="section-subtitle">
      Configura el efectivo inicial y registra cuánto efectivo contaste al
      finalizar el día.
    </p>
    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div class="flex min-w-0 items-end gap-2">
        <label class="field-label min-w-0 flex-1">
          Efectivo inicial (S/)
          <input
            v-model="opening"
            class="form-control"
            type="number"
            min="0"
            step="0.01"
            :disabled="!isEditingOpening || store.isSavingClosing"
          />
        </label>
        <button
          v-if="store.hasTodayClosing"
          class="button-secondary shrink-0"
          type="button"
          :aria-label="
            isEditingOpening
              ? 'Cancelar edición del efectivo inicial'
              : 'Editar efectivo inicial'
          "
          :title="
            isEditingOpening ? 'Cancelar edición' : 'Editar efectivo inicial'
          "
          :disabled="store.isSavingClosing || store.isLoadingData"
          @click="toggleOpeningEdit"
        >
          <svg
            v-if="!isEditingOpening"
            class="size-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m16.862 4.487 2.651 2.651M5 19l4.5-1 10.72-10.72a1.875 1.875 0 0 0-2.652-2.652L6.85 15.35 5 19Z"
            />
          </svg>
          <span v-else>Cancelar</span>
        </button>
      </div>
      <label class="field-label">
        Efectivo contado al cierre (S/)
        <input
          v-model="counted"
          class="form-control"
          type="number"
          min="0"
          step="0.01"
          placeholder="Ingresa el conteo real"
        />
      </label>
    </div>
    <div class="mt-3 flex flex-wrap gap-2">
      <button
        class="button-secondary"
        type="button"
        :disabled="store.isSavingClosing || store.isLoadingData"
        :aria-busy="store.isSavingClosing"
        @click="save"
      >
        {{
          store.isSavingClosing
            ? 'Guardando cierre…'
            : 'Guardar datos del cierre'
        }}
      </button>
    </div>
    <div class="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
      <div class="border-line rounded-xl border bg-[#0d151e] p-3">
        <span class="text-muted text-[11px]">Ventas en efectivo</span>
        <strong class="mt-2 block text-lg">
          {{ formatMoney(store.cashSales) }}
        </strong>
      </div>
      <div class="border-line rounded-xl border bg-[#0d151e] p-3">
        <span class="text-muted text-[11px]">Gastos en efectivo</span>
        <strong class="mt-2 block text-lg">
          {{ formatMoney(store.cashExpenses) }}
        </strong>
      </div>
      <div class="border-line rounded-xl border bg-[#0d151e] p-3">
        <span class="text-muted text-[11px]">Diferencia de caja</span>
        <strong
          class="mt-2 block text-lg"
          :class="
            store.cashDifference === null
              ? 'text-muted'
              : Math.abs(store.cashDifference) < 0.005
                ? 'text-accent'
                : 'text-warning'
          "
        >
          {{
            store.cashDifference === null
              ? 'Pendiente'
              : `${store.cashDifference > 0 ? '+' : ''}${formatMoney(store.cashDifference)}`
          }}
        </strong>
      </div>
    </div>
  </section>
</template>
