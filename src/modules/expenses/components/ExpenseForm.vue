<script setup lang="ts">
import { useExpenseForm } from '../composables/useExpenseForm'

const { store, form, categories, payments, submit } = useExpenseForm()
</script>

<template>
  <section class="panel-card">
    <h2 class="section-title">− Registrar un gasto</h2>
    <p class="section-subtitle">Anota compras y otros gastos operativos.</p>
    <form
      class="grid grid-cols-1 gap-3 sm:grid-cols-2"
      @submit.prevent="submit"
    >
      <label class="field-label">
        Fecha
        <input
          v-model="form.date"
          class="form-control"
          type="date"
          required
        />
      </label>
      <label class="field-label">
        Importe (S/)
        <input
          v-model="form.amount"
          class="form-control"
          type="number"
          min="0.01"
          step="0.01"
          placeholder="Ej. 18.50"
          required
        />
      </label>
      <label class="field-label">
        Categoría
        <select
          v-model="form.category"
          class="form-control"
          required
        >
          <option
            value=""
            disabled
          >
            Seleccionar...
          </option>
          <option
            v-for="category in categories"
            :key="category"
          >
            {{ category }}
          </option>
        </select>
      </label>
      <label class="field-label">
        Pagado con
        <select
          v-model="form.payment"
          class="form-control"
          required
        >
          <option
            v-for="payment in payments"
            :key="payment"
          >
            {{ payment }}
          </option>
        </select>
      </label>
      <label class="field-label sm:col-span-2">
        Descripción
        <input
          v-model="form.note"
          class="form-control"
          maxlength="120"
          placeholder="Ej. compra de champú automotriz"
        />
      </label>
      <button
        class="button-primary mt-1 sm:col-span-2"
        type="submit"
        :disabled="store.isSavingExpense || store.isLoadingData"
        :aria-busy="store.isSavingExpense"
      >
        {{ store.isSavingExpense ? 'Guardando gasto…' : 'Guardar gasto' }}
      </button>
    </form>
  </section>
</template>
