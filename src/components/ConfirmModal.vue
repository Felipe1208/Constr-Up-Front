<template>
  <Teleport to="body">
    <div class="modal-backdrop" @mousedown.self="emit('cancel')">
      <div class="confirm-modal" role="alertdialog" aria-modal="true">
        <div class="confirm-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
        </div>
        <h3>{{ title }}</h3>
        <p>{{ message }}</p>
        <div class="confirm-actions">
          <button class="btn btn-ghost" :disabled="loading" @click="emit('cancel')">Cancelar</button>
          <button class="btn btn-danger" :disabled="loading" @click="emit('confirm')">
            <span v-if="loading" class="spinner-inline"></span>
            {{ loading ? 'Excluindo…' : 'Excluir' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  title:   { type: String, default: 'Confirmar exclusão' },
  message: { type: String, default: 'Esta ação não pode ser desfeita.' },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['confirm', 'cancel'])
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 1rem;
  animation: fadeIn 0.15s ease;
  backdrop-filter: blur(2px);
}

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.confirm-modal {
  background: var(--surface);
  border-radius: var(--radius);
  padding: 2rem 2rem 1.5rem;
  max-width: 380px;
  width: 100%;
  text-align: center;
  box-shadow: 0 24px 64px rgba(15, 23, 42, 0.2);
  border: 1px solid var(--border);
  animation: slideUp 0.2s ease;
}

@keyframes slideUp {
  from { transform: translateY(16px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}

.confirm-icon {
  width: 52px;
  height: 52px;
  margin: 0 auto 1.1rem;
  background: color-mix(in srgb, var(--danger) 12%, transparent);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--danger);
}

.confirm-icon svg {
  width: 24px;
  height: 24px;
}

.confirm-modal h3 {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 0.45rem;
}

.confirm-modal p {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 1.75rem;
  line-height: 1.6;
}

.confirm-actions {
  display: flex;
  gap: 0.6rem;
  justify-content: center;
}

.spinner-inline {
  display: inline-block;
  width: 13px;
  height: 13px;
  border: 2px solid rgba(255,255,255,0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.65s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>
