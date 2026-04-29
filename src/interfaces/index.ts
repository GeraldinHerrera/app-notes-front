export interface Student {
  id?: number;
  cedula: string;
  nombre: string;
  correo: string;
  celular: string;
}

export interface Note {
  id?: number;
  estudiante_id: number;
  nota1: number;
  nota2: number;
  nota3: number;
  nota4: number;
  definitiva: number;
  materia?: string; // added optional as sometimes it comes from joins
}

export interface SearchFormProps {
  onSearch: (cedula: string, nombre: string) => void;
  isLoading?: boolean;
}
