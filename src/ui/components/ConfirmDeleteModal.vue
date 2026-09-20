<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import BaseModal from './BaseModal.vue'

const props = defineProps<{
  open: boolean
  title?: string
  description?: string
  confirmationLabel: string
  loading?: boolean
}>()

const emit = defineEmits<{
  close: []
  confirm: []
}>()

const input = ref('')

watch(() => props.open, (isOpen) => {
  if (isOpen) {
    input.value = ''
  }
})

const canConfirm = computed(() => {
  return input.value === props.confirmationLabel
})

function handleConfirm() {
  if (canConfirm.value && !props.loading) {
    emit('confirm')
  }
}
</script>

<template>
  <BaseModal
    :open="open"
    :loading="loading"
    size="sm"
    @close="emit('close')"
  >
    <template #header>
      <h2 class="text-lg font-semibold text-red-600">
        {{ title || 'Confirm Deletion' }}
      </h2>
    </template>

    <div class="space-y-4">
      <p class="text-sm text-gray-600">
        {{ description || 'This action cannot be undone. Please type the identifier to confirm.' }}
      </p>

      <div class="bg-gray-50 p-3 rounded font-mono text-sm border flex items-center justify-center font-bold">
        {{ confirmationLabel }}
      </div>

      <div>
        <label for="confirm-input" class="block text-sm font-medium text-gray-700 mb-1">
          Type the identifier to confirm
        </label>
        <input
          id="confirm-input"
          v-model="input"
          type="text"
          class="w-full rounded border-gray-300 shadow-sm px-3 py-2 border focus:border-red-500 focus:ring-red-500 sm:text-sm"
          :disabled="loading"
          autocomplete="off"
        />
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <button
          type="button"
          class="px-4 py-2 rounded border text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          :disabled="loading"
          @click="emit('close')"
        >
          Cancel
        </button>
        <button
          type="button"
          class="px-4 py-2 rounded text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          :disabled="!canConfirm || loading"
          @click="handleConfirm"
        >
          {{ loading ? 'Deleting...' : 'Delete' }}
        </button>
      </div>
    </template>
  </BaseModal>
</template>
