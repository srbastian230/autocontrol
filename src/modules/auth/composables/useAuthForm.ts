import { ref } from 'vue'
import { useAutocontrolStore } from '../../autocontrol/stores/autocontrol.store'

export function useAuthForm() {
  const store = useAutocontrolStore()
  const email = ref('')
  const password = ref('')

  function signIn() {
    return store.signIn(email.value, password.value)
  }

  function signUp() {
    if (!email.value.trim() || password.value.length < 6) {
      store.errorMessage =
        'Escribe un correo válido y una contraseña de al menos 6 caracteres.'
      store.statusMessage = ''
      return Promise.resolve(false)
    }
    return store.signUp(email.value, password.value)
  }

  return { store, email, password, signIn, signUp }
}
