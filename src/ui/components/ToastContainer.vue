<script setup lang="ts">
import { useToast } from '../composables/useToast';

type ToastType = 'success' | 'error' | 'warning' | 'info';

const { toasts, removeToast } = useToast();

const iconWrapperClass: Record<ToastType, string> = {
  success: 'bg-emerald-50 text-emerald-500',
  error: 'bg-rose-50 text-rose-500',
  warning: 'bg-amber-50 text-amber-500',
  info: 'bg-sky-50 text-sky-500',
};

const progressBarClass: Record<ToastType, string> = {
  success: 'bg-emerald-500',
  error: 'bg-rose-500',
  warning: 'bg-amber-500',
  info: 'bg-sky-500',
};
</script>

<template>
  <!-- Posicionamento do container fixado na tela -->
  <div class="fixed top-5 right-5 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
    <TransitionGroup enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-4"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0" leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
      <div v-for="toast in toasts" :key="toast.id"
        class="pointer-events-auto relative overflow-hidden flex items-start gap-3 p-4 pr-3 rounded-xl bg-white shadow-lg ring-1 ring-black/5">
        <!-- Ícone -->
        <div class="shrink-0 flex items-center justify-center h-9 w-9 rounded-full"
          :class="iconWrapperClass[toast.type]">
          <svg v-if="toast.type === 'success'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
            stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <svg v-else-if="toast.type === 'error'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
            stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <svg v-else-if="toast.type === 'warning'" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M12 9v3.75m0 3.75h.008v.008H12v-.008zM10.29 3.86l-8.18 14.18A1.5 1.5 0 003.5 20.5h17a1.5 1.5 0 001.39-2.46l-8.18-14.18a1.5 1.5 0 00-2.62 0z" />
          </svg>
          <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <!-- Mensagem -->
        <p class="flex-1 text-sm font-medium text-slate-700 leading-snug pt-1.5">{{ toast.message }}</p>

        <!-- Botão Fechar -->
        <button @click="removeToast(toast.id)"
          class="shrink-0 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Barra de progresso -->
        <div class="absolute bottom-0 left-0 h-1 w-full bg-slate-100">
          <div class="toast-progress h-full" :class="progressBarClass[toast.type]"
            :style="{ animationDuration: `${toast.duration}ms` }" />
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-progress {
  animation-name: toast-shrink;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

@keyframes toast-shrink {
  from {
    width: 100%;
  }

  to {
    width: 0%;
  }
}
</style>