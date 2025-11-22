import type { Student } from "../Types/Student";

const API_URL = 'http://localhost:8080/api/students';

// Для сессионной аутентификации используем cookies
export const fetchStudents = async (): Promise<Student[]> => {
  const response = await fetch(API_URL, {
    credentials: 'include', // Важно: отправляем cookies с каждым запросом
  });
  
  console.log('Fetch students status:', response.status);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch students: ${response.status} ${response.statusText}`);
  }
  return response.json();
};

export const deleteStudent = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    credentials: 'include', // Важно: отправляем cookies
  });
  
  console.log('Delete student status:', response.status);
  
  if (!response.ok) {
    throw new Error(`Failed to delete student: ${response.status} ${response.statusText}`);
  }
};

export const deleteStudents = async (ids: number[]): Promise<void> => {
  const response = await fetch(API_URL, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Важно: отправляем cookies
    body: JSON.stringify(ids),
  });
  
  console.log('Delete students status:', response.status);
  
  if (!response.ok) {
    throw new Error(`Failed to delete students: ${response.status} ${response.statusText}`);
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