<template>
  <main class="page">
    <header class="page-header">
      <div class="header-inner">
        <div class="brand">
          <div class="brand-logo">
            <svg viewBox="0 0 24 24" fill="none">
              <rect x="2" y="2" width="9" height="9" rx="2" fill="currentColor"/>
              <rect x="13" y="2" width="9" height="9" rx="2" fill="currentColor" opacity="0.6"/>
              <rect x="2" y="13" width="9" height="9" rx="2" fill="currentColor" opacity="0.6"/>
              <rect x="13" y="13" width="9" height="9" rx="2" fill="currentColor" opacity="0.3"/>
            </svg>
          </div>
          <span class="brand-name">Constr<span class="brand-up">Up</span></span>
          <span class="brand-divider"></span>
          <span class="brand-sub">Gestão de Produtos</span>
        </div>

        <div class="header-actions">
          <button class="theme-toggle" :title="isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'" @click="toggleTheme">
            <Transition name="icon-swap" mode="out-in">
              <!-- Moon icon -->
              <svg v-if="!isDark" key="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
              <!-- Sun icon -->
              <svg v-else key="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            </Transition>
          </button>

          <button class="btn btn-primary" @click="openCreate">
            <svg viewBox="0 0 20 20" fill="currentColor" class="btn-icon"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/></svg>
            Novo Produto
          </button>
        </div>
      </div>
    </header>

    <div class="page-body">
      <ProductFilters @filter="applyFilters" @clear="clearFilters" />

      <div class="table-toolbar">
        <div class="toolbar-left">
          <span v-if="!loading && !tableError" class="results-pill">
            {{ products.length }} {{ products.length === 1 ? 'resultado' : 'resultados' }}
          </span>
          <span v-if="loading" class="results-pill loading-pill">Buscando…</span>
        </div>
      </div>

      <ProductTable
        :products="products"
        :loading="loading"
        :error="tableError"
        @edit="openEdit"
        @delete="openDelete"
        @retry="fetchProducts"
      />
    </div>

    <ProductForm
      v-if="showForm"
      :product="editingProduct"
      :saving="saving"
      @save="handleSave"
      @cancel="closeForm"
    />

    <ConfirmModal
      v-if="deletingProduct"
      :title="`Excluir produto #${deletingProduct.id}?`"
      :message="`Você está prestes a excluir &quot;${deletingProduct.product}&quot;. Esta ação não pode ser desfeita.`"
      :loading="deleting"
      @confirm="confirmDelete"
      @cancel="deletingProduct = null"
    />

    <ToastNotification ref="toast" />
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useDarkMode } from '../composables/useDarkMode.js'
import ProductFilters from '../components/ProductFilters.vue'
import ProductTable from '../components/ProductTable.vue'
import ProductForm from '../components/ProductForm.vue'
import ConfirmModal from '../components/ConfirmModal.vue'
import ToastNotification from '../components/ToastNotification.vue'
import {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../services/productService.js'

const { isDark, toggle: toggleTheme } = useDarkMode()

const products = ref([])
const loading = ref(false)
const tableError = ref(null)
const activeFilters = ref({})

const showForm = ref(false)
const editingProduct = ref(null)
const saving = ref(false)

const deletingProduct = ref(null)
const deleting = ref(false)

const toast = ref(null)

async function fetchProducts(params = activeFilters.value) {
  loading.value = true
  tableError.value = null
  try {
    const response = await listProducts(params)
    const raw = response.data
    if (Array.isArray(raw)) {
      products.value = raw
    } else if (raw && Array.isArray(raw.data)) {
      products.value = raw.data
    } else if (raw && typeof raw === 'object') {
      const values = Object.values(raw)
      products.value = values.length && typeof values[0] === 'object' ? values : []
    } else {
      products.value = []
    }
  } catch (err) {
    tableError.value = err.message
    products.value = []
  } finally {
    loading.value = false
  }
}

function applyFilters(filters) {
  activeFilters.value = { ...filters }
  fetchProducts(activeFilters.value)
}

function clearFilters() {
  activeFilters.value = {}
  fetchProducts({})
}

function openCreate() {
  editingProduct.value = null
  showForm.value = true
}

function openEdit(product) {
  editingProduct.value = { ...product }
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  editingProduct.value = null
}

async function handleSave(data) {
  saving.value = true
  try {
    if (editingProduct.value?.id) {
      await updateProduct(editingProduct.value.id, data)
      toast.value.show('Produto atualizado com sucesso!')
    } else {
      await createProduct(data)
      toast.value.show('Produto criado com sucesso!')
    }
    closeForm()
    await fetchProducts()
  } catch (err) {
    toast.value.show(err.message, 'error')
  } finally {
    saving.value = false
  }
}

function openDelete(product) {
  deletingProduct.value = product
}

async function confirmDelete() {
  deleting.value = true
  try {
    await deleteProduct(deletingProduct.value.id)
    toast.value.show('Produto excluído com sucesso!')
    deletingProduct.value = null
    await fetchProducts()
  } catch (err) {
    toast.value.show(err.message, 'error')
  } finally {
    deleting.value = false
  }
}

onMounted(() => fetchProducts())
</script>
