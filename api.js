import axios from 'axios'
import toast from 'react-hot-toast'

const BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// ─── Request interceptor ─────────────────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cp_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ─── Response interceptor ────────────────────────────────────────────────────
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const msg = err.response?.data?.message || 'Something went wrong'
    if (err.response?.status !== 404) toast.error(msg)
    return Promise.reject(err)
  }
)

// ─── Issues ──────────────────────────────────────────────────────────────────
export const issuesAPI = {
  getAll: (params) => api.get('/issues', { params }),
  getById: (id) => api.get(`/issues/${id}`),
  create: (data) => api.post('/issues', data),
  update: (id, data) => api.patch(`/issues/${id}`, data),
  delete: (id) => api.delete(`/issues/${id}`),
  vote: (id, direction) => api.post(`/issues/${id}/vote`, { direction }),
  verify: (id) => api.post(`/issues/${id}/verify`),
  getComments: (id) => api.get(`/issues/${id}/comments`),
  addComment: (id, text) => api.post(`/issues/${id}/comments`, { text }),
  getHeatmap: (bounds) => api.get('/issues/heatmap', { params: bounds }),
  getNearby: (lat, lng, radius) => api.get('/issues/nearby', { params: { lat, lng, radius } }),
}

// ─── AI ──────────────────────────────────────────────────────────────────────
export const aiAPI = {
  analyzeImage: (formData) => api.post('/ai/analyze-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 30000,
  }),
  categorize: (text) => api.post('/ai/categorize', { text }),
  getPredictions: (city) => api.get('/ai/predictions', { params: { city } }),
  getInsights: () => api.get('/ai/insights'),
  generateWorkOrder: (issueId) => api.post(`/ai/work-order/${issueId}`),
  detectDuplicates: (issueId) => api.get(`/ai/duplicates/${issueId}`),
}

// ─── Users ───────────────────────────────────────────────────────────────────
export const usersAPI = {
  getProfile: (id) => api.get(`/users/${id}`),
  getLeaderboard: (city) => api.get('/users/leaderboard', { params: { city } }),
  updateProfile: (data) => api.patch('/users/me', data),
  getActivity: (id) => api.get(`/users/${id}/activity`),
  getBadges: (id) => api.get(`/users/${id}/badges`),
}

// ─── Dashboard ───────────────────────────────────────────────────────────────
export const dashboardAPI = {
  getStats: (city) => api.get('/dashboard/stats', { params: { city } }),
  getWeeklyData: () => api.get('/dashboard/weekly'),
  getCategoryData: () => api.get('/dashboard/categories'),
  getDepartmentPerformance: () => api.get('/dashboard/departments'),
  getImpactMetrics: () => api.get('/dashboard/impact'),
}

// ─── Predictions ─────────────────────────────────────────────────────────────
export const predictionsAPI = {
  getAll: (city) => api.get('/predictions', { params: { city } }),
  getWeather: (city) => api.get('/predictions/weather', { params: { city } }),
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  refreshToken: () => api.post('/auth/refresh'),
}

export default api
