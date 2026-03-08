import { ENV } from '@/core/constants';
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    out: './generated/drizzle',
    schema: './src/db/index.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: ENV.DATABASE_URL,
    },
});

