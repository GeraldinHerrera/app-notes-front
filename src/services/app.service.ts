import { api } from './api';
import { Note, Student } from '../interfaces';

export const appService = {
  getNotesByStudent: async (cedula: string, nombre: string) => {
    const response = await api.get<Note[]>('/notes/student', {
      params: { cedula, nombre }
    });
    return response.data;
  },

  createStudent: async (student: Student) => {
    const response = await api.post<Student>('/students', student);
    return response.data;
  },

  searchStudentId: async (cedula: string, nombre: string) => {
    const response = await api.get('/students/search', {
      params: { cedula, nombre }
    });
    return response.data;
  },

  createNote: async (note: Partial<Note>) => {
    const response = await api.post('/notes', note);
    return response.data;
  }
};
