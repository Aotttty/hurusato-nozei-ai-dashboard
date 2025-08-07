import { ProductAnalysis, PrefectureAnalysis } from '@/models/sales_data';
import { Badge } from '@/components/atoms/badge';

interface DataTableProps {
  title: string;
  data: ProductAnalysis[] | PrefectureAnalysis[];
  type: 'product' | 'prefecture';
  dataTestId?: string;
}

export function DataTable({ title, data, type, dataTestId }: DataTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(amount);
  };

  const renderTableHeader = () => {
    if (type === 'product') {
      return (
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            商品名
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            カテゴリ
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            売上
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            取引数
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            平均単価
          </th>
        </tr>
      );
    } else {
      return (
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            都道府県
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            売上
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            取引数
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            平均単価
          </th>
        </tr>
      );
    }
  };

  const renderTableRow = (item: ProductAnalysis | PrefectureAnalysis, index: number) => {
    if (type === 'product') {
      const productItem = item as ProductAnalysis;
      return (
        <tr key={index} className="hover:bg-gray-50" data-testid={`table-row-${index}`}>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
            {productItem.productName}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            <Badge variant="secondary">{productItem.category}</Badge>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
            {formatCurrency(productItem.sales)}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {productItem.transactions.toLocaleString()}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            {formatCurrency(productItem.averageOrderValue)}
          </td>
        </tr>
      );
    } else {
      const prefectureItem = item as PrefectureAnalysis;
      return (
        <tr key={index} className="hover:bg-gray-50" data-testid={`table-row-${index}`}>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
            {prefectureItem.prefecture}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
            {formatCurrency(prefectureItem.sales)}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {prefectureItem.transactions.toLocaleString()}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            {formatCurrency(prefectureItem.averageOrderValue)}
          </td>
        </tr>
      );
    }
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-lg border border-gray-200"
      data-testid={dataTestId}
    >
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900" data-testid={`${dataTestId}-title`}>
          {title}
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {renderTableHeader()}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.slice(0, 10).map((item, index) => renderTableRow(item, index))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 