<template>
  <Teleport to="body">
    <div class="modal-backdrop" @mousedown.self="handleBackdropClick">
      <div class="modal" role="dialog" aria-modal="true">

        <div class="modal-header">
          <div class="modal-title-row">
            <div class="modal-icon" :class="isEditing ? 'edit' : 'create'">
              <svg v-if="isEditing" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/></svg>
              <svg v-else viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/></svg>
            </div>
            <div>
              <h3>{{ isEditing ? 'Editar Produto' : 'Novo Produto' }}</h3>
              <p class="modal-subtitle">{{ isEditing ? `Atualizando #${product?.id}` : 'Preencha os campos abaixo' }}</p>
            </div>
          </div>
          <button class="close-btn" @click="emit('cancel')" aria-label="Fechar">
            <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
          </button>
        </div>

        <form class="modal-body" @submit.prevent="handleSubmit" novalidate>
          <div class="form-row">
            <div class="field" :class="{ invalid: errors.product }">
              <label>Produto <span class="required">*</span></label>
              <input v-model="form.product" type="text" placeholder="Nome do produto" autocomplete="off" />
              <span v-if="errors.product" class="field-error">{{ errors.product }}</span>
            </div>
            <div class="field" :class="{ invalid: errors.brand }">
              <label>Marca <span class="required">*</span></label>
              <input v-model="form.brand" type="text" placeholder="Marca" autocomplete="off" />
              <span v-if="errors.brand" class="field-error">{{ errors.brand }}</span>
            </div>
          </div>

          <div class="field">
            <label>Descrição <span class="optional">(opcional)</span></label>
            <textarea v-model="form.description" rows="2" placeholder="Descrição do produto"></textarea>
          </div>

          <div class="form-row">
            <div class="field" :class="{ invalid: errors.price }">
              <label>Preço <span class="required">*</span></label>
              <div class="input-prefix-wrap">
                <span class="input-prefix">R$</span>
                <input v-model="form.price" type="number" min="0" step="0.01" placeholder="0,00" class="with-prefix" />
              </div>
              <span v-if="errors.price" class="field-error">{{ errors.price }}</span>
            </div>
            <div class="field" :class="{ invalid: errors.stock }">
              <label>Estoque <span class="required">*</span></label>
              <div class="input-prefix-wrap">
                <span class="input-prefix">un.</span>
                <input v-model="form.stock" type="number" min="0" step="1" placeholder="0" class="with-prefix" />
              </div>
              <span v-if="errors.stock" class="field-error">{{ errors.stock }}</span>
            </div>
          </div>
        </form>

        <div class="modal-footer">
          <button class="btn btn-ghost" :disabled="saving" @click="emit('cancel')">Cancelar</button>
          <button class="btn btn-primary" :disabled="saving" @click="handleSubmit">
            <span v-if="saving" class="spinner-inline"></span>
            {{ saving ? 'Salvando…' : (isEditing ? 'Salvar alterações' : 'Criar produto') }}
          </button>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { reactive, watch, computed } from 'vue'

const props = defineProps({
  product: { type: Object, default: null },
  saving:  { type: Boolean, default: false },
})

const emit = defineEmits(['save', 'cancel'])

const isEditing = computed(() => !!props.product)

const form = reactive({ product: '', brand: '', description: '', price: '', stock: '' })
const errors = reactive({})

watch(
  () => props.product,
  (p) => {
    if (p) {
      form.product     = p.product     ?? ''
      form.brand       = p.brand       ?? ''
      form.description = p.description ?? ''
      form.price       = p.price       ?? ''
      form.stock       = p.stock       ?? ''
    }
  },
  { immediate: true }
)

function validate() {
  Object.keys(errors).forEach((k) => delete errors[k])
  if (!String(form.product).trim()) errors.product = 'Produto é obrigatório.'
  if (!String(form.brand).trim())   errors.brand   = 'Marca é obrigatória.'
  if (form.price === '' || form.price === null) {
    errors.price = 'Preço é obrigatório.'
  } else if (isNaN(Number(form.price)) || Number(form.price) < 0) {
    errors.price = 'Deve ser um número positivo.'
  }
  if (form.stock === '' || form.stock === null) {
    errors.stock = 'Estoque é obrigatório.'
  } else if (isNaN(Number(form.stock)) || Number(form.stock) < 0) {
    errors.stock = 'Deve ser um número positivo.'
  }
  return Object.keys(errors).length === 0
}

function handleSubmit() {
  if (!validate()) return
  emit('save', {
    product:     String(form.product).trim(),
    brand:       String(form.brand).trim(),
    description: String(form.description).trim(),
    price:       Number(form.price),
    stock:       Number(form.stock),
  })
}

function handleBackdropClick() {
  if (!props.saving) emit('cancel')
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1rem;
  animation: fadeIn 0.15s ease;
  backdrop-filter: blur(2px);
}

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.modal {
  background: var(--surface);
  border-radius: var(--radius);
  width: 100%;
  max-width: 540px;
  box-shadow: 0 24px 64px rgba(15, 23, 42, 0.2), 0 8px 16px rgba(15, 23, 42, 0.08);
  animation: slideUp 0.2s ease;
  border: 1px solid var(--border);
}

@keyframes slideUp {
  from { transform: translateY(16px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}

/* ── Header ── */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border);
}

.modal-title-row {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.modal-icon {
  width: 38px;
  height: 38px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.modal-icon svg { width: 18px; height: 18px; }

.modal-icon.create { background: var(--primary-light); color: var(--primary); }
.modal-icon.edit   { background: color-mix(in srgb, #22c55e 12%, transparent); color: #16a34a; }

.modal-header h3 {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text);
  margin: 0;
  line-height: 1.3;
}

.modal-subtitle {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 0.1rem;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-muted);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  transition: background 0.15s, color 0.15s;
  flex-shrink: 0;
}

.close-btn svg { width: 16px; height: 16px; }
.close-btn:hover { background: var(--surface-alt); color: var(--text); }

/* ── Body / Form ── */
.modal-body {
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.field label {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.required { color: var(--danger); }
.optional  { font-weight: 400; text-transform: none; letter-spacing: 0; color: var(--text-muted); opacity: 0.7; font-size: 0.7rem; }

.field input,
.field textarea {
  padding: 0.52rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--bg);
  color: var(--text);
  font-size: 0.875rem;
  font-family: inherit;
  transition: border-color 0.15s, box-shadow 0.15s;
  resize: vertical;
}

.field input:focus,
.field textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.field.invalid input,
.field.invalid textarea,
.field.invalid .with-prefix {
  border-color: var(--danger) !important;
}

.field.invalid input:focus,
.field.invalid textarea:focus,
.field.invalid .with-prefix:focus {
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1) !important;
}

.field-error {
  font-size: 0.72rem;
  color: var(--danger);
  font-weight: 500;
}

/* ── Prefix input ── */
.input-prefix-wrap {
  display: flex;
  align-items: stretch;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--bg);
  transition: border-color 0.15s, box-shadow 0.15s;
}

.input-prefix-wrap:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.input-prefix {
  display: flex;
  align-items: center;
  padding: 0 0.65rem;
  background: var(--surface-alt);
  border-right: 1px solid var(--border);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-muted);
  white-space: nowrap;
}

.with-prefix {
  flex: 1;
  border: none !important;
  background: transparent;
  padding: 0.52rem 0.6rem;
  color: var(--text);
  font-size: 0.875rem;
  font-family: inherit;
  outline: none;
  box-shadow: none !important;
}

/* ── Footer ── */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border);
  background: var(--surface-alt);
  border-radius: 0 0 var(--radius) var(--radius);
}

/* ── Spinner ── */
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

@media (max-width: 480px) {
  .form-row { grid-template-columns: 1fr; }
}
</style>
