import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DashboardFilters } from '@/components/molecules/DashboardFilters';

// Next.jsのモック
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

describe('DashboardFilters', () => {
  beforeEach(() => {
    render(<DashboardFilters />);
  });

  describe('Rendering', () => {
    it('renders dashboard filters container', () => {
      const container = screen.getByTestId('dashboard-filters');
      expect(container).toBeInTheDocument();
    });

    it('renders period filter', () => {
      const periodLabel = screen.getByText('period:');
      expect(periodLabel).toBeInTheDocument();
    });

    it('renders date range filter', () => {
      const dateRangeLabel = screen.getByText('dateRange:');
      expect(dateRangeLabel).toBeInTheDocument();
    });

    it('renders platforms filter', () => {
      const platformsLabel = screen.getByText('platforms:');
      expect(platformsLabel).toBeInTheDocument();
    });

    it('renders age groups filter', () => {
      const ageGroupsLabel = screen.getByText('ageGroups:');
      expect(ageGroupsLabel).toBeInTheDocument();
    });

    it('renders genders filter', () => {
      const gendersLabel = screen.getByText('genders:');
      expect(gendersLabel).toBeInTheDocument();
    });

    it('renders reset button', () => {
      const resetButton = screen.getByTestId('reset-filters-button');
      expect(resetButton).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('shows select start date placeholder', () => {
      const startDateButton = screen.getByText('selectStartDate');
      expect(startDateButton).toBeInTheDocument();
    });

    it('shows select end date placeholder', () => {
      const endDateButton = screen.getByText('selectEndDate');
      expect(endDateButton).toBeInTheDocument();
    });

    it('shows select platforms placeholder', () => {
      const platformsSelect = screen.getByText('selectPlatforms');
      expect(platformsSelect).toBeInTheDocument();
    });

    it('shows select age groups placeholder', () => {
      const ageGroupsSelect = screen.getByText('selectAgeGroups');
      expect(ageGroupsSelect).toBeInTheDocument();
    });

    it('shows select genders placeholder', () => {
      const gendersSelect = screen.getByText('selectGenders');
      expect(gendersSelect).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper test IDs for all interactive elements', () => {
      expect(screen.getByTestId('dashboard-filters')).toBeInTheDocument();
      expect(screen.getByTestId('reset-filters-button')).toBeInTheDocument();
    });
  });
}); 