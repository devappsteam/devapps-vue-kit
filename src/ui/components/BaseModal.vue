<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, watch } from 'vue';
import { X } from '@lucide/vue';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

const props = withDefaults(
    defineProps<{
        open: boolean;
        size?: ModalSize;
        closeOnBackdrop?: boolean;
        closeOnEsc?: boolean;
        closable?: boolean;
        loading?: boolean;
    }>(),
    {
        size: 'md',
        closeOnBackdrop: true,
        closeOnEsc: true,
        closable: true,
        loading: false,
    },
);

const emit = defineEmits<{
    close: [];
}>();

const sizeClasses = computed<Record<ModalSize, string>>(() => ({
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
}));

const canClose = computed(
    () => props.closable && !props.loading,
);

function handleClose() {
    if (!canClose.value) return;

    emit('close');
}

function handleBackdropClick() {
    if (props.closeOnBackdrop) {
        handleClose();
    }
}

function handleKeydown(event: KeyboardEvent) {
    if (
        event.key === 'Escape' &&
        props.open &&
        props.closeOnEsc
    ) {
        handleClose();
    }
}

function lockBodyScroll() {
    document.body.style.overflow = 'hidden';
}

function unlockBodyScroll() {
    document.body.style.overflow = '';
}

watch(
    () => props.open,
    (open) => {
        if (open) {
            lockBodyScroll();
        } else {
            unlockBodyScroll();
        }
    },
);

onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeydown);
    unlockBodyScroll();
});
</script>

<template>
    <Teleport to="body">
        <Transition name="modal">
            <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog"
                aria-modal="true">
                <!-- Backdrop -->
                <div class="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px]" @click="handleBackdropClick" />

                <!-- Content -->
                <div class="relative flex max-h-[calc(100vh-2rem)] w-full flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
                    :class="sizeClasses[size]">
                    <div v-if="$slots.header || closable"
                        class="flex shrink-0 items-start justify-between border-b border-slate-200 px-6 py-5">
                        <div class="min-w-0 flex-1">
                            <slot name="header" />
                        </div>

                        <button v-if="closable" type="button"
                            class="ml-4 rounded-md p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                            :disabled="loading" aria-label="Fechar modal" @click="handleClose">
                            <X class="size-5" />
                        </button>
                    </div>

                    <div class="min-h-0 flex-1 overflow-y-auto">
                        <slot />
                    </div>

                    <div v-if="$slots.footer" class="shrink-0 border-t border-slate-200 bg-slate-50/50 px-6 py-4">
                        <slot name="footer" />
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
    transition: opacity 150ms ease;
}

.modal-enter-active>div:last-child,
.modal-leave-active>div:last-child {
    transition:
        opacity 150ms ease,
        transform 150ms ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-from>div:last-child,
.modal-leave-to>div:last-child {
    transform: scale(0.98) translateY(8px);
    opacity: 0;
}
</style>