// SimpleComponent.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import SimpleComponent from '../SimpleComponent';

test('renders a greeting message', () => {
  render(<SimpleComponent />);
  const greetingElement = screen.getByText('Hello, Jest!');
  expect(greetingElement).toBeInTheDocument();
});
