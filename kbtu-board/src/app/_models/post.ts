export interface Post {
  id?: number;
  user_id: number;
  title: string;
  subcategory_id: number;
  description?: string;
  time?: string;
  creation_date?: Date;
  place?: string;
  photo?: string;
}
