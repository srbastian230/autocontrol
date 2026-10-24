<script setup lang="ts">
import { useSaleForm } from '../composables/useSaleForm'

const { store, form, services, vehicles, payments, submit } = useSaleForm()
</script>

<template>
  <section class="panel-card">
    <h2 class="section-title">＋ Registrar una venta</h2>
    <p class="section-subtitle">Registra cada servicio al terminarlo.</p>
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
          placeholder="Ej. 25.00"
          required
        />
      </label>
      <label class="field-label">
        Servicio
        <select
          v-model="form.service"
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
            v-for="service in services"
            :key="service"
          >
            {{ service }}
          </option>
        </select>
      </label>
      <label class="field-label">
        Vehículo
        <select
          v-model="form.vehicle"
          class="form-control"
        >
          <option
            v-for="vehicle in vehicles"
            :key="vehicle"
          >
            {{ vehicle }}
          </option>
        </select>
      </label>
      <label class="field-label">
        Método de pago
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
      <label class="field-label">
        Nota (opcional)
        <input
          v-model="form.note"
          class="form-control"
          maxlength="100"
          placeholder="Ej. placa o detalle"
        />
      </label>
      <button
        class="button-primary mt-1 sm:col-span-2"
        type="submit"
        :disabled="store.isSavingSale || store.isLoadingData"
        :aria-busy="store.isSavingSale"
      >
        {{ store.isSavingSale ? 'Guardando venta…' : 'Guardar venta' }}
      </button>
    </form>
  </section>
</template>
