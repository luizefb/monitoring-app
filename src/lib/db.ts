export const DB_CONFIG = {
  table: "TemperatureRegister",

  columns: {
    id: "id",
    timestamp: "created_at",
    temperature: "value",
    /** Umidade ainda não existe no banco — será simulada no front */
    humidity: null as null,
  },

  initialLimit: 100,
} as const
