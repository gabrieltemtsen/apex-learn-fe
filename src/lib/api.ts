import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('apexlearn-auth');
      if (stored) {
        const { state } = JSON.parse(stored);
        if (state?.accessToken) {
          config.headers.Authorization = `Bearer ${state.accessToken}`;
        }
      }
    } catch { /* ignore */ }
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const stored = localStorage.getItem('apexlearn-auth');
        if (stored) {
          const { state } = JSON.parse(stored);
          if (state?.refreshToken) {
            const { data } = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/auth/refresh`,
              { refreshToken: state.refreshToken }
            );
            // Update stored token
            const updated = { ...JSON.parse(stored), state: { ...state, accessToken: data.accessToken, refreshToken: data.refreshToken } };
            localStorage.setItem('apexlearn-auth', JSON.stringify(updated));
            error.config.headers.Authorization = `Bearer ${data.accessToken}`;
            return api.request(error.config);
          }
        }
      } catch {
        localStorage.removeItem('apexlearn-auth');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API helpers
export const authApi = {
  register: (data: { firstName: string; lastName: string; email: string; password: string; role?: string }) =>
    api.post('/auth/register', data).then(r => r.data),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }).then(r => r.data),
  refresh: (refreshToken: string) =>
    api.post('/auth/refresh', { refreshToken }).then(r => r.data),
  logout: () => api.post('/auth/logout').then(r => r.data),
  me: () => api.get('/auth/me').then(r => r.data),
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }).then(r => r.data),
  resetPassword: (token: string, password: string) =>
    api.post('/auth/reset-password', { token, password }).then(r => r.data),
};

export const coursesApi = {
  list: (params?: { category?: string; level?: string; search?: string }) =>
    api.get('/courses', { params }).then(r => r.data),
  get: (id: string) => api.get(`/courses/${id}`).then(r => r.data),
  getBySlug: (slug: string) => api.get(`/courses/slug/${slug}`).then(r => r.data),
};

export const enrollmentsApi = {
  enroll: (courseId: string) =>
    api.post('/enrollments', { courseId }).then(r => r.data),
  myEnrollments: () => api.get('/enrollments/my').then(r => r.data),
  drop: (enrollmentId: string) => api.delete(`/enrollments/${enrollmentId}`).then(r => r.data),
};

export const progressApi = {
  markComplete: (lessonId: string, courseId: string) =>
    api.post('/progress', { lessonId, courseId }).then(r => r.data),
  getCourseProgress: (courseId: string) =>
    api.get(`/progress/course/${courseId}`).then(r => r.data),
};

export const leaderboardApi = {
  top: (limit?: number) =>
    api.get('/leaderboard/top', { params: limit ? { limit } : {} }).then(r => r.data),
  byTenant: (tenantId: string, period?: string) =>
    api.get(`/leaderboard/${tenantId}`, { params: period ? { period } : {} }).then(r => r.data),
};

export const usersApi = {
  updateProfile: (userId: string, data: { firstName?: string; lastName?: string; bio?: string; jobTitle?: string }) =>
    api.patch(`/users/${userId}`, data).then(r => r.data),
  me: () => api.get('/users/me/profile').then(r => r.data),
};

export const assessmentsApi = {
  getByCourse: (courseId: string) =>
    api.get(`/assessments/course/${courseId}`).then(r => r.data),
  get: (id: string) =>
    api.get(`/assessments/${id}`).then(r => r.data),
  submit: (id: string, answers: Record<string, string>, timeTakenSeconds: number) =>
    api.post(`/assessments/${id}/attempt`, { answers, timeTakenSeconds }).then(r => r.data),
  results: (id: string) =>
    api.get(`/assessments/${id}/results`).then(r => r.data),
};

export const adminApi = {
  users: (params?: { tenantId?: string }) =>
    api.get('/users', { params }).then(r => r.data),
  promoteUser: (userId: string, role: string) =>
    api.patch(`/users/${userId}/role`, { role }).then(r => r.data),
  deleteUser: (userId: string) =>
    api.delete(`/users/${userId}`).then(r => r.data),
};

export const certificatesApi = {
  mine: () => api.get('/certificates/my').then(r => r.data),
  generate: (courseId: string, tenantId: string) =>
    api.post(`/certificates/generate/${courseId}`, { tenantId }).then(r => r.data),
  verify: (certNumber: string) =>
    api.get(`/certificates/verify/${certNumber}`).then(r => r.data),
  downloadUrl: (certNumber: string) =>
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/certificates/download/${certNumber}`,
};
