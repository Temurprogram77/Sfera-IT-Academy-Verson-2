export const QUERY_KEYS = {
  ROOMS: {
    ALL: ["rooms"] as const,
    DETAIL: (id: string | number) => ["rooms", id] as const,
  },
  USER: {
    PROFILE: ["user", "profile"],
  },
  GROUPS: {
    ALL: ["groups"],
    ALL_LIST: ["groups", "all"],
    DETAIL: (id: string | number) => ["groups", id],
    DAYS: ["groups", "days"],
  },
  AUTH: {
    USER: ["auth", "user"] as const,
  },
  STUDENTS: {
    ALL: ["students"] as const,
    DETAIL: "student-detail",
    // DETAIL: (id: string | number) => ["students", id] as const,
  },
  TEACHERS: {
    CREATE: "teachers",
    DETAIL: (id: string | number) => ["teachers", id] as const,
    TEACHERS_SIMPLE: "teachers-list"
  },
  ADMIN: {
    ALL: ["admin"],
    DETAIL: "admin-detail",
  },
  PARENTS: {
    ALL: ["parents"],
    DETAIL: "parent-detail",
    // DETAIL: (id: string | number) => ["parents", id] as const,
  },
  CATEGORIES: {
    ALL: ["categories"] as const,
    DETAIL: (id: string | number) => ["categories", id] as const,
  },
} as const;
