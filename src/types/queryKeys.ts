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
    DETAIL: (id: string | number) => ["groups", id] as const,
    DAYS: ["groups", "days"],
  },
  AUTH: {
    USER: ["auth", "user"] as const,
  },
  STUDENTS: {
    ALL: ["students"] as const,
    DETAIL: (id: string | number) => ["students", id] as const,
  },
  TEACHERS: {
    CREATE: "teachers",
  },
  ADMIN: {
    ALL: ["admin"],
  },
  PARENTS: {
    ALL: ["parents"] as const,
    DETAIL: (id: string | number) => ["parents", id] as const,
  },
} as const;
