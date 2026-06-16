import { of, throwError } from 'rxjs';
import { Todo } from '../models/todo.model';
import { TodoService } from '../services/todo.service';
import { TodoComponent } from './todo.component';

describe('TodoComponent', () => {
  let component: TodoComponent;
  let todoServiceSpy: jest.Mocked<TodoService>;

  const mockTodo: Todo = {
    id: '1',
    title: 'Test todo',
    done: false,
    createdAt: '2026-06-16T00:00:00.000Z',
    updatedAt: '2026-06-16T00:00:00.000Z'
  };

  beforeEach(() => {
    todoServiceSpy = {
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    } as unknown as jest.Mocked<TodoService>;
    component = new TodoComponent(todoServiceSpy);
  });

  it('should load todos on init', () => {
    (todoServiceSpy.findAll as jest.Mock).mockReturnValue(of([mockTodo]));

    component.ngOnInit();

    expect(component.todos).toEqual([mockTodo]);
    expect(component.loading).toBe(false);
    expect(component.error).toBe('');
  });

  it('should add a new todo when title is provided', () => {
    component.newTitle = 'New task';
    (todoServiceSpy.create as jest.Mock).mockReturnValue(of(mockTodo));

    component.addTodo();

    expect(todoServiceSpy.create).toHaveBeenCalledWith({ title: 'New task' });
    expect(component.todos[0]).toEqual(mockTodo);
    expect(component.newTitle).toBe('');
  });

  it('should not call service when adding empty title', () => {
    component.newTitle = '   ';

    component.addTodo();

    expect(todoServiceSpy.create).not.toHaveBeenCalled();
  });

  it('should toggle todo done state', () => {
    component.todos = [mockTodo];
    (todoServiceSpy.update as jest.Mock).mockReturnValue(of({ ...mockTodo, done: true }));

    component.toggleDone(mockTodo);

    expect(todoServiceSpy.update).toHaveBeenCalledWith('1', { done: true });
    expect(component.todos[0].done).toBe(true);
  });

  it('should handle load error', () => {
    (todoServiceSpy.findAll as jest.Mock).mockReturnValue(throwError(() => new Error('load failed')));

    component.loadTodos();

    expect(component.error).toBe('Impossible de charger les todos.');
    expect(component.loading).toBe(false);
  });
});
