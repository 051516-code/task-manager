import { Routes } from '@angular/router';
import { TaskListComponent } from './task/task-list/task-list.component';
import { TaskCreateComponent } from './task/task-create/task-create.component';
import { TaskEditComponent } from './task/task-edit/task-edit.component';


export const routes: Routes = [
    { path: '', component: TaskListComponent },  // Ruta Home
    { path: 'create', component: TaskCreateComponent },  // Ruta para crear tareas
    { path: 'edit/:id', component: TaskEditComponent },  // Ruta para editar tareas

  ];
