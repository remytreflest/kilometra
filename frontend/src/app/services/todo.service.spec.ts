import { HttpClient } from '@angular/common/http';
import { TodoService } from './todo.service';
import { Todo } from '../models/todo.model';
import { of } from 'rxjs';

describe('TodoService', () => {
  let service: TodoService;
  let httpClientSpy: jest.Mocked<HttpClient>;
  const mockTodo: Todo = {
    id: '1',
    title: 'Test todo',
    done: false,
    createdAt: '2026-06-16T00:00:00.000Z',
    updatedAt: '2026-06-16T00:00:00.000Z'
  };

  beforeEach(() => {
    httpClientSpy = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn()
    } as unknown as jest.Mocked<HttpClient>;
    service = new TodoService(httpClientSpy);
  });

  it('should fetch todos', () => {
    (httpClientSpy.get as jest.Mock).mockReturnValue(of({ success: true, data: [mockTodo] }));

    service.findAll().subscribe((todos) => {
      expect(todos).toEqual([mockTodo]);
    });

    expect(httpClientSpy.get).toHaveBeenCalledWith('/api/todos');
  });

  it('should create a new todo', () => {
    const payload = { title: 'Test todo' };
    (httpClientSpy.post as jest.Mock).mockReturnValue(of({ success: true, data: mockTodo }));

    service.create(payload).subscribe((todo) => {
      expect(todo).toEqual(mockTodo);
    });

    expect(httpClientSpy.post).toHaveBeenCalledWith('/api/todos', payload);
  });

  it('should update a todo', () => {
    const payload = { done: true };
    (httpClientSpy.put as jest.Mock).mockReturnValue(of({ success: true, data: mockTodo }));

    service.update('1', payload).subscribe((todo) => {
      expect(todo).toEqual(mockTodo);
    });

    expect(httpClientSpy.put).toHaveBeenCalledWith('/api/todos/1', payload);
  });

  it('should delete a todo', () => {
    (httpClientSpy.delete as jest.Mock).mockReturnValue(of({ success: true, data: { id: '1' } }));

    service.delete('1').subscribe((result) => {
      expect(result).toBeUndefined();
    });

    expect(httpClientSpy.delete).toHaveBeenCalledWith('/api/todos/1');
  });
});
