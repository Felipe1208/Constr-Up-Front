<template>
  <section class="filters-panel">
    <div class="filters-header">
      <div class="filters-title-row">
        <svg class="filters-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L13 10.414V15a1 1 0 01-.447.894l-4 2.5A1 1 0 017 17.5v-7.086L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd"/>
        </svg>
        <span class="filters-title">Filtros</span>
      </div>
    </div>

    <div class="filters-grid">
      <div class="field">
        <label>ID</label>
        <input v-model="local.id" type="text" placeholder="ex: 1" @keydown.enter="handleFilter" />
      </div>
      <div class="field">
        <label>Produto</label>
        <input v-model="local.product" type="text" placeholder="ex: asperiores" @keydown.enter="handleFilter" />
      </div>
      <div class="field">
        <label>Marca</label>
        <input v-model="local.brand" type="text" placeholder="ex: tramontina" @keydown.enter="handleFilter" />
      </div>
      <div class="field">
        <label>Descrição</label>
        <input v-model="local.description" type="text" placeholder="ex: lusto" @keydown.enter="handleFilter" />
      </div>
      <div class="field">
        <label>Preço</label>
        <input v-model="local.price" type="number" min="0" step="0.01" placeholder="ex: 150.00" @keydown.enter="handleFilter" />
      </div>
      <div class="field">
        <label>Por página</label>
        <input v-model="local.per_page" type="number" min="1" placeholder="ex: 10" @keydown.enter="handleFilter" />
      </div>
      <div class="field">
        <label>Ordenar por</label>
        <div class="select-wrap">
          <select v-model="local.order_by">
            <option value="">— nenhum —</option>
            <option value="product">Produto</option>
            <option value="price">Preço</option>
          </select>
          <svg class="select-arrow" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
        </div>
      </div>
      <div class="field">
        <label>Direção</label>
        <div class="select-wrap">
          <select v-model="local.order_dir">
            <option value="">— nenhuma —</option>
            <option value="asc">Crescente ↑</option>
            <option value="desc">Decrescente ↓</option>
          </select>
          <svg class="select-arrow" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
        </div>
      </div>
    </div>

    <div class="filters-actions">
      <button class="btn btn-primary" @click="handleFilter">
        <svg viewBox="0 0 20 20" fill="currentColor" class="btn-icon"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/></svg>
        Filtrar
      </button>
      <button class="btn btn-ghost" @click="handleClear">
        Limpar filtros
      </button>
    </div>
  </section>
</template>

<script setup>
import { reactive } from 'vue'

const emit = defineEmits(['filter', 'clear'])

const emptyState = () => ({
  id: '',
  product: '',
  brand: '',
  description: '',
  price: '',
  per_page: '',
  order_by: '',
  order_dir: '',
})

const local = reactive(emptyState())

function handleFilter() {
  emit('filter', { ...local })
}

function handleClear() {
  Object.assign(local, emptyState())
  emit('clear')
}
</script>

<style scoped>
.filters-panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  overflow: hidden;
}

.filters-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1.25rem;
  border-bottom: 1px solid var(--border);
  background: var(--surface-alt);
}

.filters-title-row {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.filters-icon {
  width: 15px;
  height: 15px;
  color: var(--primary);
}

.filters-title {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(155px, 1fr));
  gap: 0.75rem 1rem;
  padding: 1.1rem 1.25rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.field label {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.field input {
  padding: 0.48rem 0.7rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--bg);
  color: var(--text);
  font-size: 0.875rem;
  font-family: inherit;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.field input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.select-wrap {
  position: relative;
}

.select-wrap select {
  width: 100%;
  padding: 0.48rem 2rem 0.48rem 0.7rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--bg);
  color: var(--text);
  font-size: 0.875rem;
  font-family: inherit;
  appearance: none;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.select-wrap select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.select-arrow {
  pointer-events: none;
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
  color: var(--text-muted);
}

.filters-actions {
  display: flex;
  gap: 0.6rem;
  padding: 0.85rem 1.25rem;
  border-top: 1px solid var(--border);
  background: var(--surface-alt);
}

.btn-icon {
  width: 15px;
  height: 15px;
}
</style>
