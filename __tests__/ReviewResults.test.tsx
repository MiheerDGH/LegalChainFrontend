import React from 'react';
import { render } from '@testing-library/react';
import ReviewResults from '../components/ReviewResults';

describe('ReviewResults smoke', () => {
  it('renders without crashing when given empty results', () => {
    const { container } = render(<ReviewResults results={''} />);
    // Component returns null for empty results; just ensure no crash
    expect(container).toBeTruthy();
  });
});
