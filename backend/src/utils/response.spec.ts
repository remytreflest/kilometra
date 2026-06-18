import { formatResponse, formatError } from './response';

describe('response utils', () => {
  describe('formatResponse', () => {
    it('wraps data with success: true', () => {
      const result = formatResponse({ id: '1', name: 'test' });
      expect(result).toEqual({ success: true, data: { id: '1', name: 'test' } });
    });

    it('works with primitive data', () => {
      expect(formatResponse(42)).toEqual({ success: true, data: 42 });
    });

    it('works with null data', () => {
      expect(formatResponse(null)).toEqual({ success: true, data: null });
    });

    it('works with array data', () => {
      expect(formatResponse([1, 2, 3])).toEqual({ success: true, data: [1, 2, 3] });
    });
  });

  describe('formatError', () => {
    it('wraps message with success: false', () => {
      const result = formatError('Something went wrong');
      expect(result).toEqual({ success: false, error: { message: 'Something went wrong', code: undefined } });
    });

    it('includes optional code', () => {
      const result = formatError('Not found', 'NOT_FOUND');
      expect(result).toEqual({ success: false, error: { message: 'Not found', code: 'NOT_FOUND' } });
    });
  });
});
