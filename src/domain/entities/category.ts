export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: Date;
}

export interface CategoryCreate {
  name: string;
  slug: string;
  description?: string;
}
