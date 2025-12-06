import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SpotCard from '../../components/SpotCard';
import type { Spot } from '../../types';

const mockSpot: Spot = {
  id: 1,
  name: 'Test Spot',
  nameEn: 'Test Spot EN',
  nameJa: 'Test Spot JA',
  nameZh: 'Test Spot ZH',
  description: 'Test description',
  descriptionEn: 'Test description EN',
  descriptionJa: 'Test description JA',
  descriptionZh: 'Test description ZH',
  address: 'Test address',
  addressEn: 'Test address EN',
  latitude: 37.5,
  longitude: 127.0,
  category: 'drama',
  imageUrl: 'https://example.com/image.jpg',
  images: [],
  relatedContent: [],
  tags: ['test', 'drama'],
  viewCount: 100,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
};

describe('SpotCard Component', () => {
  it('renders spot name', () => {
    render(
      <BrowserRouter>
        <SpotCard spot={mockSpot} />
      </BrowserRouter>
    );

    expect(screen.getByText('Test Spot')).toBeInTheDocument();
  });

  it('renders spot image', () => {
    render(
      <BrowserRouter>
        <SpotCard spot={mockSpot} />
      </BrowserRouter>
    );

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
    expect(image).toHaveAttribute('alt', 'Test Spot');
  });

  it('links to spot detail page', () => {
    render(
      <BrowserRouter>
        <SpotCard spot={mockSpot} />
      </BrowserRouter>
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/spots/1');
  });
});
