<template>
  <Teleport to="body">
    <TransitionGroup name="toast" tag="div" class="toast-container">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="['toast', toast.type]"
      >
        <div class="toast-icon-wrap">
          <svg v-if="toast.type === 'success'" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
          <svg v-else viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
        </div>
        <span>{{ toast.message }}</span>
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'

const toasts = ref([])
let counter = 0

function show(message, type = 'success', duration = 3500) {
  const id = ++counter
  toasts.value.push({ id, message, type })
  setTimeout(() => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }, duration)
}

defineExpose({ show })
</script>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  z-index: 300;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.75rem 1.1rem;
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  font-weight: 500;
  color: #fff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  pointer-events: all;
  max-width: 360px;
  border: 1px solid rgba(255,255,255,0.15);
}

.toast.success { background: #16a34a; }
.toast.error   { background: var(--danger); }

.toast-icon-wrap {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  opacity: 0.9;
}

.toast-icon-wrap svg {
  width: 18px;
  height: 18px;
}

/* Transition */
.toast-enter-active { transition: all 0.25s ease; }
.toast-leave-active { transition: all 0.2s ease; }
.toast-enter-from   { transform: translateX(100%); opacity: 0; }
.toast-leave-to     { transform: translateX(110%); opacity: 0; }
</style>
