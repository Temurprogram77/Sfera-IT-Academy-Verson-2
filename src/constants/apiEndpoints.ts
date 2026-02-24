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
    UPDATE_PASSWORD: "/user/update-password",
  },
  STUDENT: {
    LIST: "/student",
    CREATE_STUDENT: "/auth/register",
    GET_BY_ID: (studentId: string | number) => `/student/${studentId}`,
    UPDATE: "/student",
    UPDATE_GROUP: "/student/update-group",
    DELETE: (studentId: string | number) => `/student/${studentId}`,
  },
  ATTENDANCE: {
    BASE: "/attendance",
    CREATE: "/attendance",
    GET_BY_ID: (id: number | string) => `/attendance/${id}`,
    STREAM: (groupId: number | string) => `/attendance/stream/${groupId}`,
    DELETE: (attendanceId: number | string) => `/attendance/${attendanceId}`,
  },

  TEACHER: {
    All: "/teacher/list",
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
  CATEGORY: {
    LIST: "/category",
    SEARCH: "/category/search",
    GET_BY_ID: (id: string | number) => `/category/${id}`,
    CREATE: "/category",
    UPDATE: "/category/update",
    DELETE: (id: string | number) => `/category/${id}`,
  },
  MARK: {
    LIST: "/mark",
    MY_MARKS: "/mark/myMarks",
    GET_BY_ID: (id: string | number) => `/mark/${id}`,
    CREATE: "/mark",
    BY_GROUP: (groupId: string | number) => `/mark/byGroup/${groupId}`,
    UPDATE: "/mark/update",
    DELETE: (id: string | number) => `/mark/${id}`,
  },
  NEWS: {
    LIST: "/news",
    GET_BY_ID: (id: string | number) => `/news/${id}`,
    CREATE: "/news",
    UPDATE: "/news/update",
    DELETE: (id: string | number) => `/news/${id}`,
  },
  EVENT: {
    LIST: "/event/list",
    STREAM: "/event/stream",
    CREATE: "/event",
    UPDATE: "/event/update",
    GET_BY_DATE: "/event/byDate",

    DELETE: (eventId: string | number) => `/event/${eventId}`, 
  },
  DASHBOARD_ENDPOINTS: {
    METRICS: "/dashboard",
    SCHEDULE: "/dashboard/schedule",
    TOP_STUDENTS: "/dashboard/top-students",
  },
  NOTIFICATION: {
    LIST: "/notification",
    MY: "/notification/my",
    COUNT: "/notification/count",
    GET_BY_ID: (id: string | number) => `/notification/${id}`,
    CREATE: "/notification",
    CREATE_WITH_GROUP: "/notification/withGroup",
    READ: "/notification/read",
    DELETE: (id: string | number) => `/notification/${id}`,
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
