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
    TEACHERS_SIMPLE: "teachers-list",
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
  NEWS: {
    ALL: ["news"],
    DETAIL: "news-detail",
  },
  CATEGORIES: {
    ALL: ["categories"] as const,
    SEARCH: ["categories", "search"] as const,
    DETAIL: (id: string | number) => ["categories", id] as const,
  },
  MARKS: {
    ALL: ["marks"] as const,
    DETAIL: (id: string | number) => ["marks", id] as const,
  },
  EVENTS: {
    ALL: ["events"] as const,
    LIST: ["events", "list"] as const,
    BY_DATE: ["events", "byDate"],
    DETAIL: (id: string | number) => ["events", id] as const,
  },
} as const;
