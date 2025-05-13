import { render, screen, fireEvent } from '@testing-library/react';
import Signup from '@/pages/signup/index';
import { useRouter } from 'next/router';

// Mock useRouter
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('Signup Page', () => {
  let pushMock;

  beforeEach(() => {
    pushMock = jest.fn();
    useRouter.mockReturnValue({ push: pushMock });
  });

  test('renders signup form fields correctly', () => {
    render(<Signup />);

    expect(screen.getByPlaceholderText('E-mail')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Province')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Post Code')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Telephone')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  test('shows error if passwords do not match', () => {
    render(<Signup />);

    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
      target: { value: 'differentPassword' },
    });

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
  });
});
