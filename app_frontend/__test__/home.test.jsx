import { render, screen, waitFor } from '@testing-library/react';
import HomePage from '../pages/index'; 
import '@testing-library/jest-dom';
import React from 'react';
import { Inter } from 'next/font/google';

// Mock ข้อมูลข่าว
const inter = Inter({ subsets: ['latin'] });
const mockNews = [
  {
    id: 1,
    title: 'Marine Environment News',
    content: 'This is the content of marine environment news.',
    image: '/test-image.jpg',
    author: { username: 'JohnDoe' },
    created_at: '2025-05-13T12:00:00Z',
    likes_count: 10,
    comments_count: 5,
    views: 100,
    slug: 'marine-environment-news',
  },
  // เพิ่มข่าวอื่น ๆ ตามต้องการ
];

// Mock Fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(mockNews),
  })
);

describe('HomePage', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('should render loading text initially', () => {
    render(<HomePage />);
    expect(screen.getByText('กำลังโหลดข่าว...')).toBeInTheDocument();
  });

  test('should display news when loaded', async () => {
    render(<HomePage />);

    // รอให้ข้อมูลข่าวโหลดเสร็จ
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    // ตรวจสอบว่าเนื้อหาของข่าวแสดงในหน้าเว็บ
    expect(screen.getByText('Marine Environment News')).toBeInTheDocument();
    expect(screen.getByText('This is the content of marine environment news.')).toBeInTheDocument();
    expect(screen.getByText('by JohnDoe')).toBeInTheDocument();
  });

  test('should display error message when fetching fails', async () => {
    // ทำการ mock ให้ fetch ล้มเหลว
    fetch.mockImplementationOnce(() => Promise.reject('API error'));

    render(<HomePage />);

    // รอให้ fetch เสร็จ
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    // ตรวจสอบข้อความ error
    expect(screen.getByText('ไม่สามารถโหลดข่าวได้ในขณะนี้')).toBeInTheDocument();
  });

  test('should display message when there are no news', async () => {
    // ทำการ mock ให้ fetch ส่งข้อมูลข่าวว่าง
    fetch.mockImplementationOnce(() => Promise.resolve({ json: () => Promise.resolve([]) }));

    render(<HomePage />);

    // รอให้ fetch เสร็จ
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    // ตรวจสอบข้อความเมื่อไม่มีข่าว
    expect(screen.getByText('ไม่มีข่าวในตอนนี้')).toBeInTheDocument();
  });
});
