import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';
import { Task } from '../models/task.interface';
import { of } from 'rxjs';

describe('TaskService', () => {
  let service: TaskService;
  let localStorageMock: { [key: string]: string };

  beforeEach(() => {
    // Aumentamos el tiempo de espera para permitir operaciones asincrónicas más largas
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

    // Simulación de LocalStorage
    localStorageMock = {};
    spyOn(localStorage, 'getItem').and.callFake((key: string) => localStorageMock[key] || null);
    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => {
      localStorageMock[key] = value;
    });
    spyOn(localStorage, 'clear').and.callFake(() => {
      localStorageMock = {};
    });

    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return empty array if no tasks are stored', async () => {
    const tasks = await service.getTasks().toPromise();  // Espera que el Observable se resuelva
    expect(tasks).toEqual([]);  // Espera que inicialmente sea un array vacío
  });

  it('should add a task and update localStorage', async () => {
    const newTask: Task = {
      id: 0,
      title: 'New Task',
      description: 'This is a new task.',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await service.addTask(newTask).toPromise();  // Usa toPromise() para esperar la resolución del Observable

    const tasks = JSON.parse(localStorageMock['tasks']);
    expect(tasks.length).toBe(1);
    expect(tasks[0].title).toBe('New Task');
  });

  it('should update an existing task', async () => {
    const task: Task = {
      id: 1,
      title: 'Task 1',
      description: 'Description of Task 1',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Primero agregamos la tarea
    await service.addTask(task).toPromise();

    task.title = 'Updated Task';
    await service.updateTask(task).toPromise();

    const tasks = JSON.parse(localStorageMock['tasks']);
    expect(tasks[0].title).toBe('Updated Task');
  });

  it('should delete a task and update localStorage', async () => {
    const task: Task = {
      id: 1,
      title: 'Task 1',
      description: 'Description of Task 1',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Primero agregamos la tarea
    await service.addTask(task).toPromise();

    // Luego la eliminamos
    await service.deleteTask(1).toPromise();

    const tasks = JSON.parse(localStorageMock['tasks']);
    expect(tasks.length).toBe(0);  // Verifica que la tarea haya sido eliminada
  });
});
