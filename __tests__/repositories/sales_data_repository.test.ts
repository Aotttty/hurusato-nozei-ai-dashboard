import { SalesDataRepository } from '@/repositories/sales_data_repository';
import { SalesData, Platform } from '@/models/sales_data';

// AirtableRepositoryのモック
jest.mock('@/repositories/airtable_repository', () => ({
  AirtableRepository: jest.fn().mockImplementation(() => ({
    listRecords: jest.fn(),
  })),
}));

describe('SalesDataRepository', () => {
  let repository: SalesDataRepository;
  let mockListRecords: jest.Mock;

  beforeEach(() => {
    repository = new SalesDataRepository();
    mockListRecords = jest.fn();
    (repository as any).listRecords = mockListRecords;
  });

  describe('getAllSalesData', () => {
    it('should return formatted sales data', async () => {
      const mockRecords = [
        {
          id: 'rec1',
          fields: {
            Name: 'SF2025080001',
            'ユーザーID': 'u12345',
            '商品名': 'テスト商品',
            'カテゴリ': '海鮮',
            '寄付金額': 10000,
            '注文日時': '2024-01-01',
            '都道府県': '東京都',
            '年代': '30代',
            '性別': '男性',
            '支払い方法': 'クレジットカード',
            'ステータス': '完了',
            'プラットフォームカテゴリ': ['rec1', 'rec2'],
          },
        },
      ];

      mockListRecords.mockResolvedValue(mockRecords);

      const result = await repository.getAllSalesData();

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 'rec1',
        name: 'SF2025080001',
        userId: 'u12345',
        productName: 'テスト商品',
        category: '海鮮',
        amount: 10000,
        orderDate: '2024-01-01',
        prefecture: '東京都',
        ageGroup: '30代',
        gender: '男性',
        paymentMethod: 'クレジットカード',
        status: '完了',
        platformCategory: ['rec1', 'rec2'],
      });
    });

    it('should handle missing fields gracefully', async () => {
      const mockRecords = [
        {
          id: 'rec1',
          fields: {},
        },
      ];

      mockListRecords.mockResolvedValue(mockRecords);

      const result = await repository.getAllSalesData();

      expect(result[0]).toEqual({
        id: 'rec1',
        name: '',
        userId: '',
        productName: '',
        category: '',
        amount: 0,
        orderDate: '',
        prefecture: '',
        ageGroup: '',
        gender: '',
        paymentMethod: '',
        status: '',
        platformCategory: [],
      });
    });
  });

  describe('getPlatforms', () => {
    it('should return formatted platform data', async () => {
      const mockRecords = [
        {
          id: 'rec1',
          fields: {
            Name: 'さとふる',
            '縦連結': ['rec1', 'rec2'],
          },
        },
      ];

      mockListRecords.mockResolvedValue(mockRecords);

      const result = await repository.getPlatforms();

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 'rec1',
        name: 'さとふる',
        linkedRecords: ['rec1', 'rec2'],
      });
    });
  });

  describe('getSalesSummary', () => {
    it('should calculate summary statistics correctly', async () => {
      const mockSalesData: SalesData[] = [
        {
          id: 'rec1',
          name: 'SF2025080001',
          userId: 'u1',
          productName: '商品1',
          category: '海鮮',
          amount: 10000,
          orderDate: '2024-01-01',
          prefecture: '東京都',
          ageGroup: '30代',
          gender: '男性',
          paymentMethod: 'クレジットカード',
          status: '完了',
          platformCategory: ['rec1'],
        },
        {
          id: 'rec2',
          name: 'SF2025080002',
          userId: 'u2',
          productName: '商品2',
          category: '肉類',
          amount: 15000,
          orderDate: '2024-01-02',
          prefecture: '大阪府',
          ageGroup: '40代',
          gender: '女性',
          paymentMethod: 'PayPay',
          status: '完了',
          platformCategory: ['rec1'],
        },
      ];

      jest.spyOn(repository, 'getAllSalesData').mockResolvedValue(mockSalesData);

      const result = await repository.getSalesSummary();

      expect(result).toEqual({
        totalSales: 25000,
        totalTransactions: 2,
        averageOrderValue: 12500,
        uniqueCustomers: 2,
      });
    });

    it('should filter by date range when provided', async () => {
      const mockSalesData: SalesData[] = [
        {
          id: 'rec1',
          name: 'SF2025080001',
          userId: 'u1',
          productName: '商品1',
          category: '海鮮',
          amount: 10000,
          orderDate: '2024-01-01',
          prefecture: '東京都',
          ageGroup: '30代',
          gender: '男性',
          paymentMethod: 'クレジットカード',
          status: '完了',
          platformCategory: ['rec1'],
        },
        {
          id: 'rec2',
          name: 'SF2025080002',
          userId: 'u2',
          productName: '商品2',
          category: '肉類',
          amount: 15000,
          orderDate: '2024-02-01',
          prefecture: '大阪府',
          ageGroup: '40代',
          gender: '女性',
          paymentMethod: 'PayPay',
          status: '完了',
          platformCategory: ['rec1'],
        },
      ];

      jest.spyOn(repository, 'getAllSalesData').mockResolvedValue(mockSalesData);

      const result = await repository.getSalesSummary('2024-01-01', '2024-01-31');

      expect(result).toEqual({
        totalSales: 10000,
        totalTransactions: 1,
        averageOrderValue: 10000,
        uniqueCustomers: 1,
      });
    });
  });

  describe('getTimeSeriesData', () => {
    it('should group data by date correctly', async () => {
      const mockSalesData: SalesData[] = [
        {
          id: 'rec1',
          name: 'SF2025080001',
          userId: 'u1',
          productName: '商品1',
          category: '海鮮',
          amount: 10000,
          orderDate: '2024-01-01',
          prefecture: '東京都',
          ageGroup: '30代',
          gender: '男性',
          paymentMethod: 'クレジットカード',
          status: '完了',
          platformCategory: ['rec1'],
        },
        {
          id: 'rec2',
          name: 'SF2025080002',
          userId: 'u2',
          productName: '商品2',
          category: '肉類',
          amount: 15000,
          orderDate: '2024-01-01',
          prefecture: '大阪府',
          ageGroup: '40代',
          gender: '女性',
          paymentMethod: 'PayPay',
          status: '完了',
          platformCategory: ['rec1'],
        },
      ];

      jest.spyOn(repository, 'getAllSalesData').mockResolvedValue(mockSalesData);

      const result = await repository.getTimeSeriesData('monthly');

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        date: '2024-01-01',
        sales: 25000,
        transactions: 2,
      });
    });
  });

  describe('getPlatformAnalysis', () => {
    it('should analyze platform data correctly', async () => {
      const mockSalesData: SalesData[] = [
        {
          id: 'rec1',
          name: 'SF2025080001',
          userId: 'u1',
          productName: '商品1',
          category: '海鮮',
          amount: 10000,
          orderDate: '2024-01-01',
          prefecture: '東京都',
          ageGroup: '30代',
          gender: '男性',
          paymentMethod: 'クレジットカード',
          status: '完了',
          platformCategory: ['rec1'],
        },
      ];

      const mockPlatforms: Platform[] = [
        {
          id: 'rec1',
          name: 'さとふる',
          linkedRecords: ['rec1'],
        },
      ];

      jest.spyOn(repository, 'getAllSalesData').mockResolvedValue(mockSalesData);
      jest.spyOn(repository, 'getPlatforms').mockResolvedValue(mockPlatforms);

      const result = await repository.getPlatformAnalysis();

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        platform: 'さとふる',
        sales: 10000,
        transactions: 1,
        averageOrderValue: 10000,
        uniqueCustomers: 1,
      });
    });
  });
}); 