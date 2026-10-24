<script setup lang="ts">
import { formatMoney } from '../../../shared/lib/formatters'
import { useAutocontrolStore } from '../../autocontrol/stores/autocontrol.store'

const store = useAutocontrolStore()
</script>

<template>
  <section
    class="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
    aria-label="Resumen del día"
  >
    <article class="stat-card">
      <p class="text-muted text-xs">Ventas del día</p>
      <p class="mt-2 text-2xl font-extrabold tracking-tight">
        {{ formatMoney(store.totalSales) }}
      </p>
      <p class="text-muted mt-2 text-[11px]">
        {{ store.salesToday.length }} servicios registrados
      </p>
    </article>
    <article class="stat-card">
      <p class="text-muted text-xs">Gastos del día</p>
      <p class="mt-2 text-2xl font-extrabold tracking-tight">
        {{ formatMoney(store.totalExpenses) }}
      </p>
      <p class="text-muted mt-2 text-[11px]">
        {{ store.expensesToday.length }} gastos registrados
      </p>
    </article>
    <article class="stat-card">
      <p class="text-muted text-xs">Saldo operativo estimado</p>
      <p class="mt-2 text-2xl font-extrabold tracking-tight">
        {{ formatMoney(store.totalSales - store.totalExpenses) }}
      </p>
      <p class="text-muted mt-2 text-[11px]">Ventas menos gastos registrados</p>
    </article>
    <article class="stat-card">
      <p class="text-muted text-xs">Efectivo esperado</p>
      <p class="mt-2 text-2xl font-extrabold tracking-tight">
        {{ formatMoney(store.expectedCash) }}
      </p>
      <p class="text-muted mt-2 text-[11px]">
        Apertura + efectivo recibido − efectivo pagado
      </p>
    </article>
  </section>
</template>
