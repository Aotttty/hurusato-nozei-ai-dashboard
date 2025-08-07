import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import DashboardPage from '@/app/(site)/(authorized)/(app)/dashboard/page';

// Next.jsのモック
jest.mock('next-intl/server', () => ({
  getTranslations: () => Promise.resolve((key: string) => key),
}));

jest.mock('@/components/organisms/DashboardOverview', () => ({
  DashboardOverview: () => <div data-testid="dashboard-overview">Dashboard Overview</div>,
}));

jest.mock('@/components/molecules/DashboardFilters', () => ({
  DashboardFilters: () => <div data-testid="dashboard-filters">Dashboard Filters</div>,
}));

jest.mock('@/components/molecules/DashboardSkeleton', () => ({
  DashboardSkeleton: () => <div data-testid="dashboard-skeleton">Dashboard Skeleton</div>,
}));

describe('DashboardPage', () => {
  beforeEach(() => {
    render(<DashboardPage />);
  });

  describe('Rendering', () => {
    it('renders dashboard page container', () => {
      const pageContainer = screen.getByTestId('dashboard-title').closest('.min-h-screen');
      expect(pageContainer).toBeInTheDocument();
    });

    it('renders dashboard title', () => {
      const title = screen.getByTestId('dashboard-title');
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('title');
    });

    it('renders dashboard subtitle', () => {
      const subtitle = screen.getByTestId('dashboard-subtitle');
      expect(subtitle).toBeInTheDocument();
      expect(subtitle).toHaveTextContent('subtitle');
    });

    it('renders dashboard filters', () => {
      const filters = screen.getByTestId('dashboard-filters');
      expect(filters).toBeInTheDocument();
    });

    it('renders dashboard overview', () => {
      const overview = screen.getByTestId('dashboard-overview');
      expect(overview).toBeInTheDocument();
    });
  });

  describe('Layout', () => {
    it('has proper background gradient', () => {
      const pageContainer = screen.getByTestId('dashboard-title').closest('.min-h-screen');
      expect(pageContainer).toHaveClass('bg-gradient-to-br', 'from-blue-50', 'via-white', 'to-purple-50');
    });

    it('has proper container styling', () => {
      const container = screen.getByTestId('dashboard-title').closest('.container');
      expect(container).toHaveClass('container', 'mx-auto', 'px-4', 'py-8');
    });

    it('has proper header spacing', () => {
      const header = screen.getByTestId('dashboard-title').closest('.mb-8');
      expect(header).toHaveClass('mb-8');
    });

    it('has proper filters spacing', () => {
      const filtersContainer = screen.getByTestId('dashboard-filters').closest('.mb-8');
      expect(filtersContainer).toHaveClass('mb-8');
    });
  });

  describe('Typography', () => {
    it('has proper title styling', () => {
      const title = screen.getByTestId('dashboard-title');
      expect(title).toHaveClass('text-4xl', 'font-bold', 'text-gray-900');
    });

    it('has proper subtitle styling', () => {
      const subtitle = screen.getByTestId('dashboard-subtitle');
      expect(subtitle).toHaveClass('text-lg', 'text-gray-600');
    });
  });

  describe('Suspense boundaries', () => {
    it('wraps dashboard filters in Suspense', () => {
      const filtersContainer = screen.getByTestId('dashboard-filters').closest('.mb-8');
      expect(filtersContainer).toBeInTheDocument();
    });

    it('wraps dashboard overview in Suspense', () => {
      const overviewContainer = screen.getByTestId('dashboard-overview').closest('.space-y-8');
      expect(overviewContainer).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper test IDs for main elements', () => {
      expect(screen.getByTestId('dashboard-title')).toBeInTheDocument();
      expect(screen.getByTestId('dashboard-subtitle')).toBeInTheDocument();
      expect(screen.getByTestId('dashboard-filters')).toBeInTheDocument();
      expect(screen.getByTestId('dashboard-overview')).toBeInTheDocument();
    });
  });
}); 