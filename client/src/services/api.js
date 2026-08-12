const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

export const api = {
  students: {
    getAll: () => request('/api/students'),
    getById: (id) => request(`/api/students/${id}`),
    getSubjects: (id) => request(`/api/students/${id}/subjects`),
    getInterventions: (id) => request(`/api/students/${id}/interventions`),
    createIntervention: (id, data) => request(`/api/students/${id}/interventions`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  },

  analytics: {
    getOverview: () => request('/api/analytics/overview'),
    getRiskDistribution: () => request('/api/analytics/risk-distribution'),
    getGradeDistribution: () => request('/api/analytics/grade-distribution'),
    getTrends: () => request('/api/analytics/trends'),
    getAtRisk: () => request('/api/analytics/at-risk'),
  },

  interventions: {
    getAll: (params = {}) => {
      const searchParams = new URLSearchParams(params);
      return request(`/api/interventions?${searchParams}`);
    },
    update: (id, data) => request(`/api/interventions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  },

  chat: {
    send: (message, userId) => request('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message, userId }),
    }),
  },
};

export default api;