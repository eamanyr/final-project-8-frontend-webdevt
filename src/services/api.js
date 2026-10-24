/**
 * Centralized API service for communicating with CacheUp Backend
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('cacheup_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res) => {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message = errorData.message || `Request failed with status ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.data = errorData;
    throw err;
  }
  return res.json();
};

export const api = {
  // Health
  checkHealth: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      return res.ok;
    } catch {
      return false;
    }
  },

  // Auth
  auth: {
    login: async (email, password) => {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await handleResponse(res);
      if (data.token) {
        localStorage.setItem('cacheup_token', data.token);
      }
      return data;
    },

    register: async (userData) => {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      return handleResponse(res);
    },

    me: async () => {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    logout: () => {
      localStorage.removeItem('cacheup_token');
    },
  },

  // Users
  users: {
    getAll: async () => {
      const res = await fetch(`${API_BASE_URL}/users`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    updateStatus: async (userId, status) => {
      const res = await fetch(`${API_BASE_URL}/users/${userId}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });
      return handleResponse(res);
    },

    updateProfile: async (userId, updates) => {
      const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });
      return handleResponse(res);
    },

    delete: async (userId) => {
      const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Courses
  courses: {
    getAll: async () => {
      const res = await fetch(`${API_BASE_URL}/courses`);
      return handleResponse(res);
    },

    getById: async (id) => {
      const res = await fetch(`${API_BASE_URL}/courses/${id}`);
      return handleResponse(res);
    },

    create: async (data) => {
      const res = await fetch(`${API_BASE_URL}/courses`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },

    update: async (id, data) => {
      const res = await fetch(`${API_BASE_URL}/courses/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },

    delete: async (id) => {
      const res = await fetch(`${API_BASE_URL}/courses/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Assignments
  assignments: {
    getAll: async (courseId) => {
      const url = courseId ? `${API_BASE_URL}/assignments?courseId=${courseId}` : `${API_BASE_URL}/assignments`;
      const res = await fetch(url);
      return handleResponse(res);
    },

    create: async (data) => {
      const res = await fetch(`${API_BASE_URL}/assignments`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },

    update: async (id, data) => {
      const res = await fetch(`${API_BASE_URL}/assignments/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },

    delete: async (id) => {
      const res = await fetch(`${API_BASE_URL}/assignments/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Submissions
  submissions: {
    getAll: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      const url = query ? `${API_BASE_URL}/submissions?${query}` : `${API_BASE_URL}/submissions`;
      const res = await fetch(url, { headers: getAuthHeaders() });
      return handleResponse(res);
    },

    submit: async (data) => {
      const res = await fetch(`${API_BASE_URL}/submissions`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },

    grade: async (id, { score, feedback, rubricScores, gradedBy }) => {
      const res = await fetch(`${API_BASE_URL}/submissions/${id}/grade`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ score, feedback, rubricScores, gradedBy }),
      });
      return handleResponse(res);
    },
  },

  // Quizzes
  quizzes: {
    getAll: async (courseId) => {
      const url = courseId ? `${API_BASE_URL}/quizzes?courseId=${courseId}` : `${API_BASE_URL}/quizzes`;
      const res = await fetch(url);
      return handleResponse(res);
    },

    create: async (data) => {
      const res = await fetch(`${API_BASE_URL}/quizzes`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },

    update: async (id, data) => {
      const res = await fetch(`${API_BASE_URL}/quizzes/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },

    delete: async (id) => {
      const res = await fetch(`${API_BASE_URL}/quizzes/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    getSubmissions: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      const url = query ? `${API_BASE_URL}/quizzes/submissions?${query}` : `${API_BASE_URL}/quizzes/submissions`;
      const res = await fetch(url);
      return handleResponse(res);
    },

    submit: async (data) => {
      const res = await fetch(`${API_BASE_URL}/quizzes/submit`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },
  },

  // Learning Materials
  materials: {
    getAll: async () => {
      const res = await fetch(`${API_BASE_URL}/materials`);
      return handleResponse(res);
    },

    create: async (data) => {
      const res = await fetch(`${API_BASE_URL}/materials`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },

    update: async (id, data) => {
      const res = await fetch(`${API_BASE_URL}/materials/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },

    delete: async (id) => {
      const res = await fetch(`${API_BASE_URL}/materials/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Announcements
  announcements: {
    getAll: async () => {
      const res = await fetch(`${API_BASE_URL}/announcements`);
      return handleResponse(res);
    },

    create: async (data) => {
      const res = await fetch(`${API_BASE_URL}/announcements`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },

    update: async (id, data) => {
      const res = await fetch(`${API_BASE_URL}/announcements/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },

    delete: async (id) => {
      const res = await fetch(`${API_BASE_URL}/announcements/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Schedules
  schedules: {
    getAll: async () => {
      const res = await fetch(`${API_BASE_URL}/schedule`);
      return handleResponse(res);
    },

    update: async (userId, data) => {
      const res = await fetch(`${API_BASE_URL}/schedule/${userId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },
  },
};
