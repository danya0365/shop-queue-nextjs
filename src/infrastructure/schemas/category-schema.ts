/**
 * Database schema definition for categories table
 * This provides a clear contract between the database structure and our application
 */
export interface CategoryDbSchema extends Record<string, unknown> {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}
