import { render, screen, waitFor } from '@testing-library/react';
import ConservationActivities from '@/pages/ConservationActivities';
import { useRouter } from 'next/router';


// mock fetch
global.fetch = jest.fn();


describe('ConservationActivities Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows loading initially', () => {
    render(<ConservationActivities />);
    expect(screen.getByText(/กำลังโหลด/i)).toBeInTheDocument();
  });

  test('displays error message on fetch failure', async () => {
    fetch.mockRejectedValueOnce(new Error('API failed'));

    render(<ConservationActivities />);

    await waitFor(() => {
      expect(screen.getByText(/ไม่สามารถโหลดกิจกรรมได้ในขณะนี้/i)).toBeInTheDocument();
    });
    });
    jest.mock('next/router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        pathname: '/keep',
        query: {},
    }),
    }));


  test('renders activity cards on successful fetch', async () => {
    const mockActivities = [
      {
        id: 1,
        title: 'ปลูกปะการัง',
        description: 'กิจกรรมปลูกปะการัง ณ หาดบางแสน',
        image: '/images/coral.jpg',
      },
      {
        id: 2,
        title: 'เก็บขยะชายหาด',
        description: 'อาสาสมัครร่วมเก็บขยะริมทะเล',
        image: '/images/cleanup.jpg',
      },
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockActivities,
    });

    render(<ConservationActivities />);

    // รอให้ fetch เสร็จ
    await waitFor(() => {
      expect(screen.getByText('ปลูกปะการัง')).toBeInTheDocument();
      expect(screen.getByText('เก็บขยะชายหาด')).toBeInTheDocument();
    });

    // ตรวจสอบว่ารูปภาพถูกแสดง
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThanOrEqual(2);
  });

  test('renders contact info box', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<ConservationActivities />);

    await waitFor(() => {
      expect(screen.getByText(/ติดต่อมูลนิธิอนุรักษ์ท้องทะเล/i)).toBeInTheDocument();
      expect(screen.getByText(/มูลนิธิอนุรักษ์ทะเลไทย/i)).toBeInTheDocument();
    });
  });
});
