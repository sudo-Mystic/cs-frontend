import type {
  Assessment,
  Submission,
  SubmissionInput,
  StudentProfile,
  LoginResponse,
  RegisterInput,
} from './types';

// Base API URL - configure this based on your environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

// Helper function to get authorization headers
const getAuthHeaders = (): HeadersInit => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Helper function to handle API errors
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (response.status === 401) {
    // Token expired or invalid
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/auth';
    }
    throw new Error('Authentication failed. Please login again.');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.message || 'An error occurred');
  }

  return response.json();
};

// API Functions

export const api = {
  // Authentication
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return handleResponse<LoginResponse>(response);
  },

  register: async (data: RegisterInput): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/api/users/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<{ message: string }>(response);
  },

  // Assessments
  getAssessments: async (type?: string): Promise<Assessment[]> => {
    const url = type 
      ? `${API_BASE_URL}/api/assessments/?type=${type}`
      : `${API_BASE_URL}/api/assessments/`;
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });
    return handleResponse<Assessment[]>(response);
  },

  getAssessmentById: async (id: number): Promise<Assessment> => {
    const response = await fetch(`${API_BASE_URL}/api/assessments/${id}/`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<Assessment>(response);
  },

  // Submissions
  submitAnswers: async (data: SubmissionInput): Promise<Submission> => {
    const response = await fetch(`${API_BASE_URL}/api/submissions/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Submission>(response);
  },

  getSubmissionById: async (id: number): Promise<Submission> => {
    const response = await fetch(`${API_BASE_URL}/api/submissions/${id}/`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<Submission>(response);
  },

  // Student Profile
  getStudentProfile: async (): Promise<StudentProfile> => {
    const response = await fetch(`${API_BASE_URL}/api/users/profiles/students/`, {
      headers: getAuthHeaders(),
    });
    const data = await handleResponse<StudentProfile | StudentProfile[]>(response);
    
    // If the API returns an array, get the first item
    if (Array.isArray(data)) {
      if (data.length === 0) {
        throw new Error('No student profile found');
      }
      return data[0];
    }
    
    return data as StudentProfile;
  },
};

// Token management utilities
export const tokenUtils = {
  getAccessToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  },

  getRefreshToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refresh_token');
    }
    return null;
  },

  setTokens: (access: string, refresh: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
    }
  },

  clearTokens: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  },

  isAuthenticated: (): boolean => {
    return tokenUtils.getAccessToken() !== null;
  },
};
