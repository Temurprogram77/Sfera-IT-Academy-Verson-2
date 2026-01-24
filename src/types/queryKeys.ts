export const QUERY_KEYS = {
  ROOMS: {
    ALL: ['rooms'] as const,
    DETAIL: (id: string | number) => ['rooms', id] as const,
  },


  AUTH: {
    USER: ['auth', 'user'] as const,
  },
} as const;