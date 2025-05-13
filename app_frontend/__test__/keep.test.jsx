import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SavedNewsPage from '../pages/keep/index';
import '@testing-library/jest-dom';
import { useRouter } from 'next/router';
import React from 'react';

// Mock useRouter
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock fetch API
global.fetch = jest.fn();

describe('SavedNewsPage', () => {
  
beforeAll(() => {
  const localStorageMock = (() => {
    let store = {};
    return {
      getItem: (key) => store[key] || null,
      setItem: (key, value) => { store[key] = String(value); },
      clear: () => { store = {}; },
    };
  })();
  Object.defineProperty(global, 'localStorage', { value: localStorageMock });
});


  beforeEach(() => {
    // กำหนดค่าของ useRouter
    useRouter.mockReturnValue({
      push: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    fetch.mockClear();
  });

  test('should render loading state initially', () => {
    render(<SavedNewsPage />);

    expect(screen.getByText(/กำลังโหลดข่าวที่บันทึกไว้/)).toBeInTheDocument();
  });

  test('should render news list when data is fetched', async () => {
    const mockData = [
      {
        id: 1,
        news_title: 'Test News 1',
        news_content: 'Test content for news 1',
        saved_at: '2025-05-13T00:00:00Z',
        username: 'testuser',
        news_slug: 'test-news-1',
        news_image: '/path/to/image.jpg',
      },
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    render(<SavedNewsPage />);

    // Wait for loading to finish and check for news list
    await waitFor(() => screen.getByText('Test News 1'));

    expect(screen.getByText('Test News 1')).toBeInTheDocument();
    expect(screen.getByText('โดย testuser')).toBeInTheDocument();
    expect(screen.getByText('บันทึกเมื่อ 13/5/2025')).toBeInTheDocument();
  });

  test('should display error message if fetching news fails', async () => {
    fetch.mockRejectedValueOnce(new Error('ไม่สามารถโหลดข่าวที่บันทึกได้'));

    render(<SavedNewsPage />);

    await waitFor(() => screen.getByText('ไม่สามารถโหลดข่าวที่บันทึกได้'));

    expect(screen.getByText('ไม่สามารถโหลดข่าวที่บันทึกได้')).toBeInTheDocument();
  });

  test('should call handleDelete when delete button is clicked', async () => {
    const mockData = [
      {
        id: 1,
        news_title: 'Test News 1',
        news_content: 'Test content for news 1',
        saved_at: '2025-05-13T00:00:00Z',
        username: 'testuser',
        news_slug: 'test-news-1',
        news_image: '/path/to/image.jpg',
      },
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    render(<SavedNewsPage />);

    await waitFor(() => screen.getByText('Test News 1'));

    // Mock window.confirm to simulate user confirming the delete
    window.confirm = jest.fn().mockReturnValue(true);

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    // Check if fetch is called with DELETE method
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3342/api/saved-news/1/',
      expect.objectContaining({
        method: 'DELETE',
      })
    );

    // Check if the item is removed from the news list
    await waitFor(() => expect(screen.queryByText('Test News 1')).toBeNull());
  });

  test('should navigate to the correct news page when news is clicked', async () => {
    const mockData = [
      {
        id: 1,
        news_title: 'Test News 1',
        news_content: 'Test content for news 1',
        saved_at: '2025-05-13T00:00:00Z',
        username: 'testuser',
        news_slug: 'test-news-1',
        news_image: '/path/to/image.jpg',
      },
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const push = jest.fn();
    useRouter.mockReturnValue({
      push,
    });

    render(<SavedNewsPage />);

    await waitFor(() => screen.getByText('Test News 1'));

    // Simulate clicking on the news item
    fireEvent.click(screen.getByText('Test News 1'));

    // Check if the router.push was called with the correct path
    expect(push).toHaveBeenCalledWith('/news/2025-05-13/test-news-1');
  });
});
