import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Login from '../pages/login/index'; // ให้แน่ใจว่า import path ถูกต้อง

describe('Login', () => {
  it('renders inputs', () => {
    const { container } = render(<Login />); // ใช้ render จาก React Testing Library
    const username = container.querySelector('input[name="username"]');
    const password = container.querySelector('input[name="password"]');
    
    // ตรวจสอบว่า input element ถูก render ในหน้า
    expect(username).toBeInTheDocument();
    expect(password).toBeInTheDocument();
  });
});
