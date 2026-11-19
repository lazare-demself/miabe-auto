import { neon } from '@neondatabase/serverless';

// Le fallback permet à Next.js de compiler sans se connecter à la base.
// Les requêtes réelles échoueront tant que DATABASE_URL n'est pas configurée.
export const sql = neon(process.env.DATABASE_URL || 'postgresql://build:build@localhost/miabe_build');
