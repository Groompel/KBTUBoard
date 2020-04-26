export interface User {
  id?: number;
  token?: string;
  username: string;
  password: string;
  name: string;
  telegram_chat_id: number;
  telegram_username: string;
  profile_photo?: string;
  faculty?: string;
  gender?: number;
  year_of_study?: number;
  teacher_info?: TeacherInfo;
}

export interface TeacherInfo {
  faculty: string;
  subjects: string[];
  rating: number;
  quote: string;
}
