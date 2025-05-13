import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfilePage from '../pages/profile/[username]';
import { useRouter } from 'next/router';
import { Inter } from 'next/font/google';

// Mocking useRouter hook
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mocking localStorage
beforeAll(() => {
  global.localStorage = {
    getItem: jest.fn(() => 'mocked-jwt-access-token'), // mock the token
    setItem: jest.fn(),
    removeItem: jest.fn(),
  };
});
const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <div className={inter.className}>
      <h1>Welcome to Next.js</h1>
    </div>
  );
}

describe('ProfilePage', () => {
  beforeEach(() => {
    // Reset the mock for every test case
    useRouter.mockReturnValue({
      isReady: true,
      query: { username: 'testuser' },
    });
  });

  test('should display loading state initially', () => {
    render(<ProfilePage />);
    expect(screen.getByText(/กำลังโหลดข้อมูล/i)).toBeInTheDocument();
  });

  test('should display profile information when fetched successfully', async () => {
    const mockProfileData = {
      username: 'testuser',
      profile_image: 'http://localhost:3342/images/testuser.jpg',
      email: 'testuser@example.com',
      phone: '123-456-7890',
      address: '123 Test Street',
    };

    // Mocking the fetch call
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProfileData),
      })
    );

    render(<ProfilePage />);

    await waitFor(() => expect(screen.getByText('testuser')).toBeInTheDocument());

    expect(screen.getByText('testuser@example.com')).toBeInTheDocument();
    expect(screen.getByText('123-456-7890')).toBeInTheDocument();
    expect(screen.getByText('123 Test Street')).toBeInTheDocument();
    expect(screen.getByAltText('User Profile')).toHaveAttribute('src', 'http://localhost:3342/images/testuser.jpg');
  });

  test('should show error message if profile fetch fails', async () => {
    // Mocking the fetch call to return an error
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
      })
    );

    render(<ProfilePage />);

    await waitFor(() => expect(screen.getByText(/ไม่พบข้อมูลโปรไฟล์/i)).toBeInTheDocument());
  });

  test('should upload a new profile image successfully', async () => {
    const mockProfileData = {
      username: 'testuser',
      profile_image: 'http://localhost:3342/images/testuser.jpg',
    };

    // Mocking the fetch call for profile fetch
    global.fetch = jest.fn((url) =>
      url.includes('upload-profile-image') ?
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ profile_image: 'http://localhost:3342/images/new-image.jpg' }),
        }) :
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockProfileData),
        })
    );

    render(<ProfilePage />);

    const fileInput = screen.getByLabelText(/คลิกเพื่อเปลี่ยนรูป/i);

    // Simulate file upload
    const file = new Blob(['test'], { type: 'image/jpeg' });
    const fileName = 'test-image.jpg';
    Object.defineProperty(fileInput, 'files', {
      value: [new File([file], fileName)],
    });

    fireEvent.change(fileInput);

    await waitFor(() => expect(screen.getByAltText('User Profile')).toHaveAttribute('src', 'http://localhost:3342/images/new-image.jpg'));
  });

  test('should log out the user', () => {
    render(<ProfilePage />);

    const logoutButton = screen.getByText('Log Out');
    fireEvent.click(logoutButton);

    expect(localStorage.removeItem).toHaveBeenCalledWith('jwt_access');
    expect(window.location.pathname).toBe('/login');
  });
});
