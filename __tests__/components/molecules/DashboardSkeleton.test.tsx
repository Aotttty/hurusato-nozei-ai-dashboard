import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { DashboardSkeleton } from '@/components/molecules/DashboardSkeleton';

describe('DashboardSkeleton', () => {
  beforeEach(() => {
    render(<DashboardSkeleton />);
  });

  describe('Rendering', () => {
    it('renders dashboard skeleton container', () => {
      const container = screen.getByTestId('dashboard-skeleton');
      expect(container).toBeInTheDocument();
    });

    it('renders stat card skeletons', () => {
      for (let i = 0; i < 4; i++) {
        const statCardSkeleton = screen.getByTestId(`stat-card-skeleton-${i}`);
        expect(statCardSkeleton).toBeInTheDocument();
      }
    });

    it('renders chart skeletons', () => {
      for (let i = 0; i < 2; i++) {
        const chartSkeleton = screen.getByTestId(`chart-skeleton-${i}`);
        expect(chartSkeleton).toBeInTheDocument();
      }
    });

    it('renders table skeleton', () => {
      const tableSkeleton = screen.getByTestId('table-skeleton');
      expect(tableSkeleton).toBeInTheDocument();
    });
  });

  describe('Structure', () => {
    it('has proper spacing between sections', () => {
      const container = screen.getByTestId('dashboard-skeleton');
      expect(container).toHaveClass('space-y-8');
    });

    it('renders stat cards in grid layout', () => {
      const statCardsContainer = screen.getByTestId('stat-card-skeleton-0').parentElement;
      expect(statCardsContainer).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4');
    });

    it('renders charts in grid layout', () => {
      const chartsContainer = screen.getByTestId('chart-skeleton-0').parentElement;
      expect(chartsContainer).toHaveClass('grid', 'grid-cols-1', 'lg:grid-cols-2');
    });
  });

  describe('Animation', () => {
    it('has animate-pulse class for loading animation', () => {
      const statCardSkeleton = screen.getByTestId('stat-card-skeleton-0');
      const animatePulseElement = statCardSkeleton.querySelector('.animate-pulse');
      expect(animatePulseElement).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper test IDs for all skeleton elements', () => {
      expect(screen.getByTestId('dashboard-skeleton')).toBeInTheDocument();
      
      // Stat card skeletons
      for (let i = 0; i < 4; i++) {
        expect(screen.getByTestId(`stat-card-skeleton-${i}`)).toBeInTheDocument();
      }
      
      // Chart skeletons
      for (let i = 0; i < 2; i++) {
        expect(screen.getByTestId(`chart-skeleton-${i}`)).toBeInTheDocument();
      }
      
      // Table skeleton
      expect(screen.getByTestId('table-skeleton')).toBeInTheDocument();
    });
  });
}); 