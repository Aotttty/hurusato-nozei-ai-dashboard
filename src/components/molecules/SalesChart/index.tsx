'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { TimeSeriesData, PlatformAnalysis, CustomerAnalysis, CategoryAnalysis } from '@/models/sales_data';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface SalesChartProps {
  type: 'line' | 'bar' | 'doughnut';
  title: string;
  data: TimeSeriesData[] | PlatformAnalysis[] | CustomerAnalysis[] | CategoryAnalysis[];
  dataTestId?: string;
}

export function SalesChart({ type, title, data, dataTestId }: SalesChartProps) {
  const chartData = (() => {
    switch (type) {
      case 'line':
        const timeSeriesData = data as TimeSeriesData[];
        return {
          labels: timeSeriesData.map(item => item.date),
          datasets: [
            {
              label: '売上',
              data: timeSeriesData.map(item => item.sales),
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              tension: 0.4,
            },
            {
              label: '取引数',
              data: timeSeriesData.map(item => item.transactions),
              borderColor: 'rgb(16, 185, 129)',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              tension: 0.4,
            },
          ],
        };

      case 'bar':
        const platformData = data as PlatformAnalysis[];
        return {
          labels: platformData.map(item => item.platform),
          datasets: [
            {
              label: '売上',
              data: platformData.map(item => item.sales),
              backgroundColor: [
                'rgba(59, 130, 246, 0.8)',
                'rgba(16, 185, 129, 0.8)',
                'rgba(245, 158, 11, 0.8)',
              ],
            },
          ],
        };

      case 'doughnut':
        // カテゴリ分析データの場合はカテゴリ別の円グラフを表示
        if (data.length > 0 && 'category' in data[0]) {
          const categoryData = data as CategoryAnalysis[];
          return {
            labels: categoryData.map(item => item.category),
            datasets: [
              {
                data: categoryData.map(item => item.sales),
                backgroundColor: [
                  'rgba(59, 130, 246, 0.8)',
                  'rgba(16, 185, 129, 0.8)',
                  'rgba(245, 158, 11, 0.8)',
                  'rgba(236, 72, 153, 0.8)',
                  'rgba(139, 92, 246, 0.8)',
                  'rgba(34, 197, 94, 0.8)',
                  'rgba(239, 68, 68, 0.8)',
                  'rgba(14, 165, 233, 0.8)',
                ],
              },
            ],
          };
        }
        
        // 顧客分析データの場合は性別別の円グラフを表示
        const customerData = data as CustomerAnalysis[];
        const genderData = customerData.reduce((acc, item) => {
          if (!acc[item.gender]) {
            acc[item.gender] = 0;
          }
          acc[item.gender] += item.sales;
          return acc;
        }, {} as Record<string, number>);

        return {
          labels: Object.keys(genderData),
          datasets: [
            {
              data: Object.values(genderData),
              backgroundColor: [
                'rgba(59, 130, 246, 0.8)',
                'rgba(236, 72, 153, 0.8)',
              ],
            },
          ],
        };

      default:
        return { labels: [], datasets: [] };
    }
  })();

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem: unknown) {
            const item = tooltipItem as { label?: string; parsed?: number; raw?: unknown };
            const label = item.label || '';
            const value = typeof item.parsed === 'number' ? item.parsed : 
                         typeof item.raw === 'number' ? item.raw : 0;
            
            // カテゴリ分析の場合はパーセンテージも表示
            if (data.length > 0 && 'category' in data[0]) {
              const categoryData = data as CategoryAnalysis[];
              const category = categoryData.find(item => item.category === label);
              if (category) {
                return `${label}: ¥${value.toLocaleString()} (${category.percentage.toFixed(1)}%)`;
              }
            }
            
            return `${label}: ¥${value.toLocaleString()}`;
          }
        }
      }
    },
    scales: type !== 'doughnut' ? {
      y: {
        beginAtZero: true,
      },
    } : undefined,
  } as const;

  const renderChart = () => {
    switch (type) {
      case 'line':
        return <Line data={chartData} options={options} />;
      case 'bar':
        return <Bar data={chartData} options={options} />;
      case 'doughnut':
        return <Doughnut data={chartData} options={options} />;
      default:
        return null;
    }
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
      data-testid={dataTestId}
    >
      <div className="h-64">
        {renderChart()}
      </div>
    </div>
  );
} 