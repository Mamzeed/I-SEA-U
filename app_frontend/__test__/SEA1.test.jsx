import { render, screen, waitFor } from '@testing-library/react';
import SEA1 from '@/pages/SEA1/index';
import { useRouter } from 'next/router';

// Mock useRouter
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => (store[key] = value),
    clear: () => (store = {}),
  };
})();
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock global fetch
global.fetch = jest.fn();

describe('SEA1 Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('jwt_access', 'fake-token');
    useRouter.mockReturnValue({ push: jest.fn() });
  });

  test('renders loading state initially', () => {
    render(<SEA1 />);
    expect(screen.getByText(/กำลังโหลด/i)).toBeInTheDocument();
  });

  test('redirects to login if no token', async () => {
    localStorage.clear(); // ลบ token
    const pushMock = jest.fn();
    useRouter.mockReturnValue({ push: pushMock });

    render(<SEA1 />);
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/login');
    });
  });

  test('shows error message when fetch fails', async () => {
    fetch.mockRejectedValueOnce(new Error('API failed'));

    render(<SEA1 />);
    await waitFor(() =>
      expect(screen.getByText(/ไม่สามารถโหลดข่าวได้ในขณะนี้/i)).toBeInTheDocument()
    );
  });

  test('displays news data when fetch is successful', async () => {
    const mockNews = [
      {
        id: 1,
        title: 'ทดสอบข่าวทะเล',
        content: 'รายละเอียดของข่าวทะเล...',
        author: { username: 'admin' },
        created_at: '2024-01-01T00:00:00Z',
        image: '/some-image.jpg',
        likes_count: 10,
        comments_count: 2,
        views: 50,
        slug: 'marine-news',
      },
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockNews,
    });

    render(<SEA1 />);
    expect(await screen.findByText('ทดสอบข่าวทะเล')).toBeInTheDocument();
    expect(screen.getByText(/Like 10/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Read/i })).toBeInTheDocument();
  });
});
