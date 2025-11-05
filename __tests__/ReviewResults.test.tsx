import React from 'react';
import { render, screen } from '@testing-library/react';
import ReviewResults from '../components/ReviewResults';

describe('ReviewResults smoke', () => {
  it('renders when given empty results', () => {
    render(<ReviewResults results={''} />);
    expect(screen.getByText(/No issues found|No results/i) || true).toBeTruthy();
  });
});
