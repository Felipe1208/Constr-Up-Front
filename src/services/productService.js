import api from './api.js'

/**
 * Remove keys with empty/null/undefined values so they don't pollute the query string.
 */
function cleanParams(params) {
  return Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== '' && v !== null && v !== undefined)
  )
}

export function listProducts(params = {}) {
  return api.get('/product', { params: cleanParams(params) })
}

export function getProductById(id) {
  return api.get(`/product/${id}`)
}

export function createProduct(data) {
  return api.post('/product', data)
}

export function updateProduct(id, data) {
  return api.put(`/product/${id}`, data)
}

export function deleteProduct(id) {
  return api.delete(`/product/${id}`)
}
