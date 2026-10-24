<script setup lang="ts">
import { formatToday } from '../../../shared/lib/dates'
import { useAutocontrolStore } from '../../autocontrol/stores/autocontrol.store'

const store = useAutocontrolStore()
</script>

<template>
  <header class="mb-6 flex flex-wrap items-center justify-between gap-4">
    <div class="flex items-center gap-3">
      <div
        class="bg-accent grid size-12 place-items-center rounded-2xl text-2xl font-black text-[#092018]"
      >
        A
      </div>
      <div>
        <p
          class="text-accent text-[11px] font-extrabold tracking-[.13em] uppercase"
        >
          Panel de administración
        </p>
        <h1 class="mt-1 text-2xl font-extrabold tracking-tight">
          AutoControl
          <span class="text-accent">Car Wash</span>
        </h1>
      </div>
    </div>
    <div class="flex flex-wrap items-center gap-3">
      <p
        class="border-line text-muted rounded-xl border bg-[#111a24] px-3 py-2.5 text-sm"
      >
        {{ formatToday() }}
      </p>
      <button
        v-if="store.isAuthenticated"
        type="button"
        class="button-secondary"
        :disabled="store.isSigningOut"
        :aria-busy="store.isSigningOut"
        @click="store.signOut"
      >
        {{ store.isSigningOut ? 'Cerrando sesión…' : 'Cerrar sesión' }}
      </button>
    </div>
  </header>
</template>
