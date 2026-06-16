import { formatResponse, formatError } from '../../../utils/response';

describe('response helpers', () => {
  test('formatResponse wraps data', () => {
    const r = formatResponse({ a: 1 });
    expect(r).toEqual({ success: true, data: { a: 1 } });
  });

  test('formatError wraps message', () => {
    const e = formatError('boom', 'ERR');
    expect(e).toEqual({ success: false, error: { message: 'boom', code: 'ERR' } });
  });
});
