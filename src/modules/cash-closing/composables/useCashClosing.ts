import { ref, watch } from 'vue'
import { useAutocontrolStore } from '../../autocontrol/stores/autocontrol.store'
import type { CashClosingInput } from '../models/cashClosing.models'

export function useCashClosing() {
  const store = useAutocontrolStore()
  const opening = ref<CashClosingInput['opening']>(0)
  const counted = ref<CashClosingInput['counted']>('')
  const isEditingOpening = ref(true)

  watch(
    () => store.todayClosing,
    (closing) => {
      opening.value = closing.opening
      counted.value = closing.counted ?? ''
    },
    { immediate: true },
  )

  watch(
    () => store.hasTodayClosing,
    (hasClosing) => {
      isEditingOpening.value = !hasClosing
    },
    { immediate: true },
  )

  function toggleOpeningEdit() {
    if (isEditingOpening.value) {
      opening.value = store.todayClosing.opening
      isEditingOpening.value = false
      return
    }
    isEditingOpening.value = true
  }

  async function save() {
    const saved = await store.saveClosing({
      opening: opening.value,
      counted: counted.value,
    })
    if (saved) isEditingOpening.value = false
    return saved
  }

  return { store, opening, counted, isEditingOpening, toggleOpeningEdit, save }
}
