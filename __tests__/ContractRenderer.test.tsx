import React from 'react';
import { render, screen } from '@testing-library/react';
import ContractRenderer from '../components/ContractRenderer';

describe('ContractRenderer', () => {
  it('renders plain text contract', () => {
    render(<ContractRenderer contract={'This is a test contract.'} structure={[]} references={[]} />);
    expect(screen.getByText(/This is a test contract/)).toBeInTheDocument();
  });
});
