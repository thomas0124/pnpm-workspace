import type { Config } from 'drizzle-kit'

export default {
  schema: './infrastructure/persistence/drizzle/schema/*.ts',
  out: './infrastructure/persistence/drizzle/migrations',
  dialect: 'sqlite',
} satisfies Config