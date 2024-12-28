// src/app/models/task.interface.ts
export interface Task {
    id: number;
    title: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed';  // Estatus de la tarea
    createdAt: Date;
    updatedAt: Date;
  }
  