export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
  },
  ROOM: {
    LIST: "/room",
    CREATE: "/room",
    GET_BY_ID: (roomId: string | number) => `/room/${roomId}`,
    UPDATE: "/room/update",
    DELETE: (roomId: string | number) => `/room/${roomId}`,
  },
  USER: {
    PROFILE: "/user/me",
  },
  STUDENT: {
    LIST: "/student",
    CREATE_STUDENT: "/student/saveStudent",
    GET_BY_ID: (studentId: string | number) => `/student/${studentId}`,
    UPDATE: "/student",
    DELETE: (studentId: string | number) => `/student/${studentId}`,
  },
  TEACHER: {
    LIST: "/teacher",
    CREATE_TEACHER: "/teacher/saveUser",
    UPDATE: "/teacher",
    DELETE: (teacherId: string | number) => `/teacher/${teacherId}`,
    GET_BY_ID: (teacherId: string | number) => `/teacher/${teacherId}`,
  },
  ADMIN: {
    LIST: "/admin",
    CREATE_ADMIN: "/admin/saveUser",
    UPDATE_ADMIN: "/admin",
    GET_BY_ID: (adminId: string | number) => `/admin/${adminId}`,
    DELETE_ADMIN: (adminId: string | number) => `/admin/${adminId}`,
  },
  GROUP: {
    ALL: "/group/all",
    LIST: "/group",
    CREATE: "/group",
    UPDATE: "/group/update",
    DELETE: (id: number | string) => `/group/${id}`,
    GET_BY_ID: (id: number | string) => `/group/${id}`,
    GET_DAYS: "/group/getDays",
  },
  PARENT: {
    LIST: "/parent",
    CREATE: "/parent",
    UPDATE: "/parent",
    GET_BY_ID: (parentId: string | number) => `/parent/${parentId}`,
    DELETE: (parentId: string | number) => `/parent/${parentId}`,
  },
  FILE: {
    UPLOAD: "/api/v1/files/upload",
  },
} as const;

export const buildUrlWithParams = (
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined | null>,
): string => {
  if (!params) return endpoint;

  const queryString = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join("&");

  return queryString ? `${endpoint}?${queryString}` : endpoint;
};
