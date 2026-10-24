<script setup lang="ts">
import { useAuthForm } from '../composables/useAuthForm'

const { store, email, password, signIn, signUp } = useAuthForm()
</script>

<template>
  <section
    class="border-line bg-panel/95 mx-auto mb-5 w-full max-w-xl rounded-2xl border p-6 shadow-2xl shadow-black/20"
  >
    <h2 class="mb-2 text-lg font-bold">Acceso seguro</h2>
    <p class="text-muted mb-5 text-sm leading-relaxed">
      Inicia sesión para consultar los registros guardados en la nube.
    </p>
    <form
      class="space-y-4"
      @submit.prevent="signIn"
    >
      <label class="text-muted block space-y-2 text-xs">
        <span>Correo electrónico</span>
        <input
          v-model="email"
          type="email"
          autocomplete="username"
          placeholder="tu-correo@ejemplo.com"
          required
          class="form-control"
        />
      </label>
      <label class="text-muted block space-y-2 text-xs">
        <span>Contraseña</span>
        <input
          v-model="password"
          type="password"
          autocomplete="current-password"
          minlength="6"
          required
          class="form-control"
        />
      </label>
      <div class="grid grid-cols-1 gap-4 pt-1 sm:flex sm:flex-wrap">
        <button
          class="button-primary w-full sm:w-auto sm:min-w-36"
          type="submit"
          :disabled="store.authAction !== null"
          :aria-busy="store.authAction === 'signIn'"
        >
          {{ store.authAction === 'signIn' ? 'Ingresando…' : 'Iniciar sesión' }}
        </button>
        <button
          class="button-secondary w-full sm:w-auto"
          type="button"
          :disabled="store.authAction !== null"
          :aria-busy="store.authAction === 'signUp'"
          @click="signUp"
        >
          {{
            store.authAction === 'signUp'
              ? 'Creando cuenta…'
              : 'Crear cuenta nueva'
          }}
        </button>
      </div>
    </form>
    <p
      v-if="store.errorMessage"
      role="alert"
      class="text-danger mt-4 text-sm break-words"
    >
      {{ store.errorMessage }}
    </p>
    <p
      v-else-if="store.statusMessage"
      role="status"
      class="text-muted mt-4 text-sm break-words"
    >
      {{ store.statusMessage }}
    </p>
  </section>
</template>
