// API Response Types

export interface Question {
  id: number;
  question_text: string;
  question_type: 'mcq' | 'subjective';
  options?: string[];
  marks: number;
}

export interface Assessment {
  id: number;
  title: string;
  description?: string;
  type: string;
  duration?: number;
  total_marks: number;
  passing_marks: number;
  questions: Question[];
  created_at: string;
  updated_at: string;
}

export interface AnswerInput {
  question: number;
  answer_text: string;
}

export interface SubmissionInput {
  assessment: number;
  answers: AnswerInput[];
}

export interface AnswerResult {
  id: number;
  question: Question;
  answer_text: string;
  is_correct: boolean;
  marks_obtained: number;
  reasoning: string;
}

export interface Submission {
  id: number;
  assessment: number;
  student: number;
  status: 'pending' | 'graded';
  score: number; // This is the percentage score
  total_questions: number;
  correct_answers: number;
  submitted_at: string;
  graded_at?: string;
  answers: AnswerResult[];
}

export interface StudentProfile {
  id: number;
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  phone: string;
  qual_status: 'pending' | 'qualified' | 'not_qualified';
  prequalification_score: number | null;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface RegisterInput {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone: string;
  designation: string;
  password: string;
  confirm_password: string;
}
