import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../pages/login';

describe('Login', () => {
  it('renders inputs', () => {
    const { container } = render(<Login />);
    const username = container.querySelector(`input[name="username"]`);
    const password = container.querySelector(`input[name="password"]`);
    expect(username).toBeInTheDocument();
    expect(password).toBeInTheDocument();
  });
});
