import prisma from '../../config/database';

export class TodoService {
  static async findAll() {
    return prisma.todo.findMany({ orderBy: { createdAt: 'desc' } });
  }

  static async create(payload: { title: string }) {
    return prisma.todo.create({ data: { title: payload.title } });
  }

  static async update(id: string, payload: Partial<{ title: string; done: boolean }>) {
    return prisma.todo.update({ where: { id }, data: payload });
  }

  static async delete(id: string) {
    return prisma.todo.delete({ where: { id } });
  }
}
