<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'

const props = defineProps<{
  open: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closeOnBackdrop?: boolean
  closeOnEsc?: boolean
  closable?: boolean
  loading?: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const isVisible = ref(props.open)

watch(() => props.open, (newVal) => {
  isVisible.value = newVal
  if (newVal) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onUnmounted(() => {
  document.body.style.overflow = ''
})

function handleBackdropClick() {
  if (props.closeOnBackdrop !== false && !props.loading && props.closable !== false) {
    emit('close')
  }
}

function handleEscape(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.open && props.closeOnEsc !== false && !props.loading && props.closable !== false) {
    emit('close')
  }
}

// Add event listener for Escape key
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', handleEscape)
  onUnmounted(() => window.removeEventListener('keydown', handleEscape))
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isVisible" class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 p-4 sm:p-0" @click="handleBackdropClick">
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to-class="opacity-100 translate-y-0 sm:scale-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0 sm:scale-100"
          leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div
            v-if="isVisible"
            class="relative w-full rounded-lg bg-white shadow-xl flex flex-col max-h-[90vh]"
            :class="sizeClasses[props.size || 'md']"
            @click.stop
          >
            <!-- Header -->
            <div v-if="$slots.header || props.closable !== false" class="flex items-center justify-between border-b px-6 py-4">
              <div class="flex-1">
                <slot name="header"></slot>
              </div>
              <button
                v-if="props.closable !== false"
                type="button"
                class="ml-4 text-gray-400 hover:text-gray-500 disabled:opacity-50"
                :disabled="props.loading"
                @click="emit('close')"
              >
                <span class="sr-only">Close</span>
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Body -->
            <div class="p-6 overflow-y-auto">
              <slot></slot>
            </div>

            <!-- Footer -->
            <div v-if="$slots.footer" class="border-t px-6 py-4 bg-gray-50 rounded-b-lg">
              <slot name="footer"></slot>
            </div>
            
            <!-- Loading Overlay -->
            <div v-if="props.loading" class="absolute inset-0 bg-white/50 flex items-center justify-center rounded-lg z-10">
               <div class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
