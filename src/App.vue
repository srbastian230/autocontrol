<script setup lang="ts">
import { onMounted } from 'vue'
import { useAutocontrolStore } from './modules/autocontrol/stores/autocontrol.store'
import AuthPanel from './modules/auth/components/AuthPanel.vue'
import AppHeader from './modules/dashboard/components/AppHeader.vue'
import DailySummary from './modules/dashboard/components/DailySummary.vue'
import SaleForm from './modules/sales/components/SaleForm.vue'
import ExpenseForm from './modules/expenses/components/ExpenseForm.vue'
import CashClosing from './modules/cash-closing/components/CashClosing.vue'
import MovementsTable from './modules/movements/components/MovementsTable.vue'

const store = useAutocontrolStore()

onMounted(() => store.initialize())
</script>

<template>
  <div class="mx-auto max-w-6xl px-3 pt-4 pb-12 sm:px-4 sm:pt-6">
    <AppHeader />
    <section
      v-if="store.isInitializing"
      class="border-line bg-panel/95 text-muted mx-auto flex max-w-xl items-center gap-3 rounded-2xl border p-6 text-sm"
      role="status"
      aria-live="polite"
    >
      <span
        class="border-accent size-5 animate-spin rounded-full border-2 border-t-transparent"
        aria-hidden="true"
      ></span>
      Verificando sesión y preparando tu espacio…
    </section>
    <AuthPanel
      v-else-if="!store.isAuthenticated || store.authAction !== null"
    />
    <main v-else>
      <div
        class="mb-4 rounded-xl border border-[#6a5428] bg-[#2a2418] px-4 py-3 text-xs leading-relaxed text-[#ffe0a0]"
      >
        <strong>Conectado a Supabase:</strong>
        las ventas, gastos y cierres se cargan desde la nube después de iniciar
        sesión. Usa esta versión primero con datos de prueba; aún no es un
        sistema contable ni emite comprobantes SUNAT.
      </div>
      <p
        v-if="store.errorMessage"
        role="alert"
        class="border-danger/40 bg-danger/10 text-danger mb-4 rounded-xl border p-3 text-sm"
      >
        {{ store.errorMessage }}
      </p>
      <p
        v-if="store.statusMessage"
        role="status"
        class="border-accent/30 bg-accent/10 text-accent-soft mb-4 rounded-xl border p-3 text-sm"
      >
        {{ store.statusMessage }}
      </p>
      <div
        v-if="store.isLoadingData"
        class="border-line bg-panel text-muted mb-4 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm"
        role="status"
        aria-live="polite"
      >
        <span
          class="border-accent size-4 animate-spin rounded-full border-2 border-t-transparent"
          aria-hidden="true"
        ></span>
        Actualizando la información…
      </div>
      <DailySummary />
      <div class="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SaleForm />
        <ExpenseForm />
      </div>
      <CashClosing />
      <MovementsTable />
      <p class="text-muted mt-5 text-[11px] leading-relaxed">
        AutoControl Car Wash · Versión inicial conectada a Supabase. No procesa
        pagos, no emite comprobantes SUNAT y no reemplaza la contabilidad.
        Mantén copias de respaldo y prueba la seguridad antes de usar datos
        reales.
      </p>
    </main>
  </div>
</template>
