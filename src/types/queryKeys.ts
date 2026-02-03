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
  },
  AUTH: {
    USER: ["auth", "user"] as const,
  },
  STUDENTS: {
    ALL: ["students"] as const,
    DETAIL: (id: string | number) => ["students", id] as const,
  },
  TEACHERS:{
    CREATE:"teachers"
  }
} as const;
