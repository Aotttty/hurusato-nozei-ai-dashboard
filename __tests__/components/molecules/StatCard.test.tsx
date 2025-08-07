import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { StatCard } from '@/components/molecules/StatCard';
import { DollarSignIcon } from 'lucide-react';

describe('StatCard', () => {
  const defaultProps = {
    title: 'Total Sales',
    value: 1000000,
    dataTestId: 'test-stat-card',
  };

  describe('Rendering', () => {
    it('renders stat card with title and value', () => {
      render(<StatCard {...defaultProps} />);
      
      const card = screen.getByTestId('test-stat-card');
      const title = screen.getByTestId('test-stat-card-title');
      const value = screen.getByTestId('test-stat-card-value');
      
      expect(card).toBeInTheDocument();
      expect(title).toHaveTextContent('Total Sales');
      expect(value).toHaveTextContent('1,000,000');
    });

    it('renders stat card with string value', () => {
      render(<StatCard {...defaultProps} value="¥1,000,000" />);
      
      const value = screen.getByTestId('test-stat-card-value');
      expect(value).toHaveTextContent('¥1,000,000');
    });

    it('renders stat card with icon', () => {
      render(<StatCard {...defaultProps} icon={DollarSignIcon} />);
      
      const icon = screen.getByTestId('test-stat-card-icon');
      expect(icon).toBeInTheDocument();
    });

    it('renders stat card with custom icon color', () => {
      render(
        <StatCard 
          {...defaultProps} 
          icon={DollarSignIcon} 
          iconColor="text-green-600" 
        />
      );
      
      const icon = screen.getByTestId('test-stat-card-icon');
      expect(icon).toHaveClass('text-green-600');
    });

    it('renders stat card with change indicator', () => {
      const change = { value: 15.5, isPositive: true };
      render(<StatCard {...defaultProps} change={change} />);
      
      const changeElement = screen.getByTestId('test-stat-card-change');
      expect(changeElement).toHaveTextContent('+15.5%');
      expect(changeElement).toHaveClass('text-green-600');
    });

    it('renders stat card with negative change indicator', () => {
      const change = { value: 8.2, isPositive: false };
      render(<StatCard {...defaultProps} change={change} />);
      
      const changeElement = screen.getByTestId('test-stat-card-change');
      expect(changeElement).toHaveTextContent('8.2%');
      expect(changeElement).toHaveClass('text-red-600');
    });
  });

  describe('Accessibility', () => {
    it('has proper test IDs for all elements', () => {
      render(<StatCard {...defaultProps} icon={DollarSignIcon} />);
      
      expect(screen.getByTestId('test-stat-card')).toBeInTheDocument();
      expect(screen.getByTestId('test-stat-card-title')).toBeInTheDocument();
      expect(screen.getByTestId('test-stat-card-value')).toBeInTheDocument();
      expect(screen.getByTestId('test-stat-card-icon')).toBeInTheDocument();
    });

    it('does not render change indicator when not provided', () => {
      render(<StatCard {...defaultProps} />);
      
      expect(screen.queryByTestId('test-stat-card-change')).not.toBeInTheDocument();
    });

    it('does not render icon when not provided', () => {
      render(<StatCard {...defaultProps} />);
      
      expect(screen.queryByTestId('test-stat-card-icon')).not.toBeInTheDocument();
    });
  });

  describe('Number formatting', () => {
    it('formats large numbers with commas', () => {
      render(<StatCard {...defaultProps} value={1234567} />);
      
      const value = screen.getByTestId('test-stat-card-value');
      expect(value).toHaveTextContent('1,234,567');
    });

    it('formats zero correctly', () => {
      render(<StatCard {...defaultProps} value={0} />);
      
      const value = screen.getByTestId('test-stat-card-value');
      expect(value).toHaveTextContent('0');
    });
  });
}); 