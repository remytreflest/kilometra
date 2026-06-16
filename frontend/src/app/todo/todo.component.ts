import { Component, OnInit } from '@angular/core';
import { TodoService } from '../services/todo.service';
import { Todo } from '../models/todo.model';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {
  todos: Todo[] = [];
  newTitle = '';
  loading = false;
  error = '';

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.loading = true;
    this.error = '';

    this.todoService.findAll().subscribe({
      next: (todos) => {
        this.todos = todos;
        this.loading = false;
      },
      error: () => {
        this.error = 'Impossible de charger les todos.';
        this.loading = false;
      }
    });
  }

  addTodo(): void {
    if (!this.newTitle.trim()) {
      return;
    }

    const title = this.newTitle.trim();
    this.newTitle = '';

    this.todoService.create({ title }).subscribe({
      next: (todo) => {
        this.todos.unshift(todo);
      },
      error: () => {
        this.error = 'Impossible d’ajouter le todo.';
      }
    });
  }

  toggleDone(todo: Todo): void {
    this.todoService.update(todo.id, { done: !todo.done }).subscribe({
      next: (updated) => {
        todo.done = updated.done;
      },
      error: () => {
        this.error = 'Impossible de mettre à jour le todo.';
      }
    });
  }

  deleteTodo(id: string): void {
    this.todoService.delete(id).subscribe({
      next: () => {
        this.todos = this.todos.filter((todo) => todo.id !== id);
      },
      error: () => {
        this.error = 'Impossible de supprimer le todo.';
      }
    });
  }
}
