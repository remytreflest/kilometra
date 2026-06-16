export function formatResponse<T>(data: T) {
  return { success: true, data } as const;
}

export function formatError(message: string, code?: string) {
  return { success: false, error: { message, code } } as const;
}
