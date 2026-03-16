<template>
  <div class="table-wrapper">
    <!-- Loading skeleton -->
    <template v-if="loading">
      <table class="product-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Produto</th>
            <th>Marca</th>
            <th>Descrição</th>
            <th class="right">Preço</th>
            <th class="right">Estoque</th>
            <th class="center">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="n in 5" :key="n" class="skeleton-row">
            <td><span class="skel skel-xs"></span></td>
            <td><span class="skel skel-md"></span></td>
            <td><span class="skel skel-sm"></span></td>
            <td><span class="skel skel-lg"></span></td>
            <td class="right"><span class="skel skel-sm"></span></td>
            <td class="right"><span class="skel skel-xs"></span></td>
            <td class="center"><span class="skel skel-actions"></span></td>
          </tr>
        </tbody>
      </table>
    </template>

    <!-- Error state -->
    <div v-else-if="error" class="state-overlay error">
      <div class="state-icon-wrap error-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
      </div>
      <p class="state-title">Falha ao carregar produtos</p>
      <p class="state-desc">{{ error }}</p>
      <button class="btn btn-primary btn-sm" @click="emit('retry')">Tentar novamente</button>
    </div>

    <!-- Empty state -->
    <div v-else-if="!products.length" class="state-overlay empty">
      <div class="state-icon-wrap empty-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M7 15h.01M11 15h2"/></svg>
      </div>
      <p class="state-title">Nenhum produto encontrado</p>
      <p class="state-desc">Tente ajustar os filtros ou cadastre um novo produto.</p>
    </div>

    <!-- Table -->
    <table v-else class="product-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Produto</th>
          <th>Marca</th>
          <th>Descrição</th>
          <th class="right">Preço</th>
          <th class="right">Estoque</th>
          <th class="center">Ações</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="product in products" :key="product.id">
          <tr :class="{ selected: selectedId === product.id }">
            <td class="id-cell">#{{ product.id }}</td>
            <td class="bold-cell">{{ product.product }}</td>
            <td class="brand-cell">{{ product.brand }}</td>
            <td class="desc-cell">{{ product.description || '—' }}</td>
            <td class="right price-cell">{{ formatPrice(product.price) }}</td>
            <td class="right">
              <span :class="['stock-badge', stockClass(product.stock)]">
                {{ product.stock }}
              </span>
            </td>
            <td class="center actions-cell">
              <button class="action-btn edit" title="Editar" @click="emit('edit', product)">
                <svg viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/></svg>
              </button>
              <button class="action-btn delete" title="Excluir" @click="emit('delete', product)">
                <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
              </button>
              <button
                class="action-btn view"
                :title="selectedId === product.id ? 'Fechar detalhes' : 'Ver detalhes'"
                @click="toggleDetail(product)"
              >
                <svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/></svg>
              </button>
            </td>
          </tr>
          <tr v-if="selectedId === product.id" :key="`detail-${product.id}`" class="detail-row">
            <td colspan="7">
              <div class="detail-panel">
                <div class="detail-grid">
                  <div class="detail-item">
                    <span class="detail-label">Produto</span>
                    <span class="detail-value">{{ product.product }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Marca</span>
                    <span class="detail-value">{{ product.brand }}</span>
                  </div>
                  <div class="detail-item detail-item--wide">
                    <span class="detail-label">Descrição</span>
                    <span class="detail-value">{{ product.description || '—' }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Preço</span>
                    <span class="detail-value highlight">{{ formatPrice(product.price) }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Estoque</span>
                    <span :class="['stock-badge', stockClass(product.stock)]">{{ product.stock }} un.</span>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  products: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  error: { type: String, default: null },
})

const emit = defineEmits(['edit', 'delete', 'retry'])

const selectedId = ref(null)

function toggleDetail(product) {
  selectedId.value = selectedId.value === product.id ? null : product.id
}

function formatPrice(value) {
  const num = parseFloat(value)
  if (isNaN(num)) return '—'
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function stockClass(stock) {
  const n = parseInt(stock)
  if (isNaN(n) || n === 0) return 'out'
  if (n <= 5) return 'low'
  return 'ok'
}
</script>

<style scoped>
.table-wrapper {
  overflow-x: auto;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  box-shadow: var(--shadow);
}

/* ── States ── */
.state-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 4rem 1rem;
  text-align: center;
}

.state-icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.25rem;
}

.state-icon-wrap svg {
  width: 26px;
  height: 26px;
}

.error-icon  { background: color-mix(in srgb, var(--danger) 12%, transparent); color: var(--danger); }
.empty-icon  { background: var(--surface-alt); color: var(--text-muted); }

.state-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text);
}

.state-desc {
  font-size: 0.82rem;
  color: var(--text-muted);
  max-width: 320px;
  margin-bottom: 0.5rem;
}

/* ── Skeleton ── */
.skeleton-row td { border-bottom: 1px solid var(--border); padding: 0.85rem 0.9rem; }
.skeleton-row:last-child td { border-bottom: none; }

.skel {
  display: inline-block;
  height: 12px;
  border-radius: 6px;
  background: linear-gradient(90deg, var(--surface-alt) 25%, var(--border) 50%, var(--surface-alt) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s ease infinite;
}

.skel-xs      { width: 36px; }
.skel-sm      { width: 70px; }
.skel-md      { width: 110px; }
.skel-lg      { width: 160px; }
.skel-actions { width: 88px; height: 26px; border-radius: var(--radius-sm); }

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ── Table ── */
.product-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.product-table th,
.product-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
}

.product-table thead th {
  background: var(--surface-alt);
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--text-muted);
  position: sticky;
  top: 0;
  z-index: 1;
}

.product-table thead th:first-child { border-radius: var(--radius) 0 0 0; }
.product-table thead th:last-child  { border-radius: 0 var(--radius) 0 0; }

.product-table tbody tr:last-child td { border-bottom: none; }
.product-table tbody tr:hover:not(.detail-row) { background: var(--hover); }
.product-table tbody tr.selected { background: var(--primary-light); }

.right  { text-align: right; }
.center { text-align: center; }

.id-cell    { color: var(--text-muted); font-size: 0.78rem; font-variant-numeric: tabular-nums; }
.bold-cell  { font-weight: 600; color: var(--text); }
.brand-cell { color: var(--text-muted); }
.desc-cell  { color: var(--text-muted); max-width: 200px; overflow: hidden; text-overflow: ellipsis; }
.price-cell { font-variant-numeric: tabular-nums; font-weight: 600; color: var(--text); }

/* ── Stock badge ── */
.stock-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.6rem;
  border-radius: 99px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}
.stock-badge.ok  { background: color-mix(in srgb, #22c55e 15%, transparent); color: #16a34a; }
.stock-badge.low { background: color-mix(in srgb, #f59e0b 15%, transparent); color: #b45309; }
.stock-badge.out { background: color-mix(in srgb, var(--danger) 15%, transparent); color: var(--danger); }

html.dark .stock-badge.ok  { color: #4ade80; }
html.dark .stock-badge.low { color: #fbbf24; }

/* ── Actions ── */
.actions-cell {
  display: flex;
  gap: 0.35rem;
  justify-content: center;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, border-color 0.15s, transform 0.1s;
}

.action-btn svg { width: 15px; height: 15px; }
.action-btn:active { transform: scale(0.88); }

.action-btn.edit   { background: var(--primary-light); color: var(--primary); border-color: color-mix(in srgb, var(--primary) 30%, transparent); }
.action-btn.delete { background: color-mix(in srgb, var(--danger) 10%, transparent); color: var(--danger); border-color: color-mix(in srgb, var(--danger) 25%, transparent); }
.action-btn.view   { background: color-mix(in srgb, #22c55e 10%, transparent); color: #16a34a; border-color: color-mix(in srgb, #22c55e 25%, transparent); }

.action-btn.edit:hover   { background: color-mix(in srgb, var(--primary) 18%, transparent); }
.action-btn.delete:hover { background: color-mix(in srgb, var(--danger) 18%, transparent); }
.action-btn.view:hover   { background: color-mix(in srgb, #22c55e 18%, transparent); }

/* ── Detail row ── */
.detail-row td {
  padding: 0;
  background: var(--primary-light);
  border-top: 1px solid color-mix(in srgb, var(--primary) 25%, transparent);
  border-bottom: 1px solid color-mix(in srgb, var(--primary) 25%, transparent);
}

.detail-panel {
  padding: 1rem 1.25rem;
}

.detail-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 2.5rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.detail-item--wide { flex: 1 1 100%; }

.detail-label {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--text-muted);
}

.detail-value {
  font-size: 0.875rem;
  color: var(--text);
}

.detail-value.highlight {
  font-weight: 700;
  color: var(--primary);
  font-size: 1rem;
}
</style>
