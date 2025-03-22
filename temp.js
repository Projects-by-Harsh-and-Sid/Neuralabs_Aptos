import axios from 'axios';

// const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const BASE_URL = process.env.REACT_APP_API_URL ;
const API_KEY = process.env.REACT_APP_API_KEY || 'SuperSecretTokenValue6969420';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY,
  },
});

// Activities API
export const activitiesApi = {
  getAll: () => api.get('/activity/list'),
  get: (id) => api.get(`/activity/${id}`),
  create: (data) => api.post('/activity/new', data),
  update: (id, data) => api.put(`/activity/${id}`, data),
  delete: (id) => api.delete(`/activity/${id}`),
};

// Planner API
export const plannerApi = {
  getAll: () => api.get('/plans'),
  get: (id) => api.get(`/plan/${id}`),
  create: (data) => api.post('/plan/new', data),
  update: (id, data) => api.put(`/plan/${id}`, data),
  delete: (id) => api.delete(`/plan/${id}`),
  duplicate: (id) => api.post(`/plan/${id}/duplicate`),
};

// // Logger API
// export const loggerApi = {
//   getLogs: () => api.get('/logs'),
//   createLog: (data) => api.post('/log/new', data),
//   updateLog: (id, data) => api.put(`/log/${id}`, data),
//   deleteLog: (id) => api.delete(`/log/${id}`),
// };



export const scheduleApi = {
  getAll: () => api.get('/schedules'),
  get: (id) => api.get(`/schedule/${id}`),
  create: (data) => api.post('/schedule/new', data),
  update: (id, data) => api.put(`/schedule/${id}`, data),
  delete: (id) => api.delete(`/schedule/${id}`),
  updateStatus: (id, status) => api.put(`/schedule/${id}/status`, status),
  getScheduleData: (id) => api.get(`/schedule/${id}/data`),
  updateActivityReps: (id, uid, data) => 
    api.put(`/schedule/${id}/activity/${uid}`, data),
  createActivityReps: (id, data) => 
    api.post(`/schedule/${id}/activity/new`, data)
};



// Logger API
export const loggerApi = {
  // Weight logging
  getWeightLogs: (params) => api.get('/logs/weight', { params }),
  logWeight: (data) => api.post('/logs/weight', data),
  
  // Activity logging
  getActivityLogs: (params) => api.get('/logs/activity', { params }),
  logActivity: (data) => api.post('/logs/activity', data),
  deleteActivityLog: (date, activityId) => api.delete(`/logs/activity/${date}/${activityId}`),
  
  // Weekly logs
  getWeeklyLogs: (weekStart) => api.get(`/logs/weekly/${weekStart}`),

  getWeightVisualization: (params) => api.get('/logs/weight/visualization', { params }),
};


export default api;



import { loggerApi, scheduleApi, activitiesApi } from '../../utils/api';

loggerApi.getActivityLogs({ start_date: startDate, end_date: endDate }),
loggerApi.getWeightLogs({ start_date: startDate, end_date: endDate })