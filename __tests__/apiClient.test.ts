import { post, get } from '../lib/apiClient';

describe('apiClient basic', () => {
  it('exports methods', () => {
    expect(typeof post).toBe('function');
    expect(typeof get).toBe('function');
  });
});
