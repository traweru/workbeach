import type { Student } from "../Types/Student";

const API_URL = 'http://localhost:8080/api/students';

// Для сессионной аутентификации используем cookies
export const fetchStudents = async (): Promise<Student[]> => {
  try {
    const token = localStorage.getItem('authToken');
    console.log('Fetching students with token:', token);
    
    const response = await fetch('http://localhost:8080/api/students', {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });
    
    console.log('Fetch response status:', response.status);
    
    if (!response.ok) {
      if (response.status === 403) {
        
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/';
        throw new Error('Authentication failed. Please login again.');
      }
      throw new Error(`Failed to fetch students: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Fetched students:', data);
    return data;
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
};
export const deleteStudent = async (id: number): Promise<void> => {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  });
  
  console.log('Delete student status:', response.status);
  
  if (response.status === 403) {
    throw new Error('Access denied. Only ADMIN users can delete students.');
  }
  
  if (!response.ok) {
    throw new Error(`Failed to delete student: ${response.status}`);
  }
};

export const deleteStudents = async (ids: number[]): Promise<void> => {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch(API_URL, {
    method: 'DELETE',
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(ids),
  });
  
  console.log('Delete students status:', response.status);
  
  if (response.status === 403) {
    throw new Error('Access denied. Only ADMIN users can delete students.');
  }
  
  if (!response.ok) {
    throw new Error(`Failed to delete students: ${response.status}`);
  }
};


export const createStudent = async (student: Omit<Student, 'id'>): Promise<Student> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Важно: отправляем cookies
    body: JSON.stringify(student),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create student');
  }
  return response.json();
};

export const updateStudent = async (id: number, student: Omit<Student, 'id'>): Promise<Student> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Важно: отправляем cookies
    body: JSON.stringify(student),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update student');
  }
  return response.json();
};