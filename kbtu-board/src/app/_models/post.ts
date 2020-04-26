export interface Post {
  user_id: number;
  id: number;
  title: string;
  subcategory_id: number;
  description?: string;
  time?: string;
  creation_date?: Date;
  place?: string;
  photo?: string;
}
