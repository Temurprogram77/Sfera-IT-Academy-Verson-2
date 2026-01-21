export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    VERIFY: '/auth/verify',
  },
  STUDENT:{
    GETALLSTUDENT: '/student/get-page-student',
  },


} as const;

export const buildUrlWithParams = (
  endpoint: string,
  params?: Record<string, string | number | boolean>
): string => {
  if (!params) return endpoint;

  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');

  return queryString ? `${endpoint}?${queryString}` : endpoint;
};