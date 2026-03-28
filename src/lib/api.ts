import axios from 'axios';

let _getToken: (() => Promise<string | null>) | null = null;

export function setClerkTokenProvider(fn: () => Promise<string | null>) {
  _getToken = fn;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  if (typeof window !== 'undefined' && _getToken) {
    const token = await _getToken().catch(() => null);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => Promise.reject(error)
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
  list: (params?: { category?: string; level?: string; search?: string; isPublished?: boolean }) =>
    api.get('/courses', { params }).then(r => r.data),
  get: (id: string) => api.get(`/courses/${id}`).then(r => r.data),
  getBySlug: (slug: string) => api.get(`/courses/slug/${slug}`).then(r => r.data),
  mine: () => api.get('/courses/mine').then(r => r.data),
  create: (data: {
    title: string; description: string; tenantId?: string;
    category?: string; level?: string; durationHours?: number; thumbnailUrl?: string; tags?: string;
  }) => api.post('/courses', data).then(r => r.data),
  update: (id: string, data: object) => api.patch(`/courses/${id}`, data).then(r => r.data),
  publish: (id: string) => api.post(`/courses/${id}/publish`).then(r => r.data),
  remove: (id: string) => api.delete(`/courses/${id}`).then(r => r.data),
};

export const lessonsApi = {
  getByCourse: (courseId: string) =>
    api.get(`/lessons/course/${courseId}`).then(r => r.data),
  get: (id: string) => api.get(`/lessons/${id}`).then(r => r.data),
  create: (data: {
    courseId: string; title: string; description?: string;
    type?: string; videoUrl?: string; content?: string; durationSeconds?: number; order?: number; isFree?: boolean;
  }) => api.post('/lessons', data).then(r => r.data),
  update: (id: string, data: object) => api.patch(`/lessons/${id}`, data).then(r => r.data),
  remove: (id: string) => api.delete(`/lessons/${id}`).then(r => r.data),
};

export const enrollmentsApi = {
  enroll: (courseId: string, tenantId?: string) =>
    api.post('/enrollments', { courseId, ...(tenantId ? { tenantId } : {}) }).then(r => r.data),
  myEnrollments: () => api.get('/enrollments/my').then(r => r.data),
  drop: (enrollmentId: string) => api.delete(`/enrollments/${enrollmentId}`).then(r => r.data),
};

export const progressApi = {
  markComplete: (lessonId: string, courseId: string) =>
    api.post('/progress', { lessonId, courseId }).then(r => r.data),
  getCourseProgress: (courseId: string) =>
    api.get(`/progress/course/${courseId}`).then(r => r.data),
};

export const tenantsApi = {
  getDefault: () => api.get('/tenants/default').then(r => r.data as { id: string }),
  list: () => api.get('/tenants').then(r => r.data),
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
