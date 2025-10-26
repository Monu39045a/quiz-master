/// User interface
export interface User {
  user_id: string;
  name: string;
  email: string;
  isLoggedIn: boolean;
  role: "trainer" | "participant" | null;
}

///// Quiz interface
export interface Option {
  optionId: string;
  optionValue: string;
}

export interface Question {
  quizId: string;
  quesId: string;
  ques: string;
  options: Option[];
  weight: number;
}

export interface Quiz {
  quidId: string;
  trainerId: string;
  title: string;
  status: "scheduled" | "started" | "completed";
  startTime: string | null;
  duration: number;
  questions?: Question[];
}

/// Login
export interface LoginResponse {
  user: User;
  token: string;
}

///////////////////////////////////////////////////// URLS API ENDPOINTS
export const BASE_URL = "http://127.0.0.1:8000";
export const LOGIN_URL = `${BASE_URL}/auth/login`;
export const REGISTER_URL = `${BASE_URL}/auth/register`;
