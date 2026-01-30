export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
  },
  ROOM: {
    LIST: '/room',
    CREATE: '/room',
    GET_BY_ID: (roomId: string | number) => `/room/${roomId}`,
    UPDATE: '/room/update',
    DELETE: (roomId: string | number) => `/room/${roomId}`,
  },
  USER: {
    PROFILE: "/user/me",
  },
  STUDENT: {
    LIST: '/student',
    CREATE_STUDENT: '/student/saveStudent',
    CREATE_PARENT: '/student/saveParent',
    GET_BY_ID: (studentId: string | number) => `/student/${studentId}`,
    UPDATE: '/student',
    DELETE:  (studentId: string | number) => `/student/${studentId}`,
  }
} as const;

export const buildUrlWithParams = (
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined | null>
): string => {
  if (!params) return endpoint;

  const queryString = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join('&');

  return queryString ? `${endpoint}?${queryString}` : endpoint;
};