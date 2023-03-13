import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

//TODO: remove then add appropriate tests
test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
  expect(linkElement).toBeInTheDocument();
  
});
