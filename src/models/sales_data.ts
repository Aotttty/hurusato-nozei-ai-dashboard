import { z } from "zod";

export const SalesDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  userId: z.string(),
  productName: z.string(),
  category: z.string(),
  amount: z.number(),
  orderDate: z.string(),
  prefecture: z.string(),
  ageGroup: z.string(),
  gender: z.string(),
  paymentMethod: z.string(),
  status: z.string(),
  platformCategory: z.array(z.string()),
});

export type SalesData = z.infer<typeof SalesDataSchema>;

export const PlatformSchema = z.object({
  id: z.string(),
  name: z.string(),
  linkedRecords: z.array(z.string()),
});

export type Platform = z.infer<typeof PlatformSchema>;

// 分析用の集計データ型
export const SalesSummarySchema = z.object({
  totalSales: z.number(),
  totalTransactions: z.number(),
  averageOrderValue: z.number(),
  uniqueCustomers: z.number(),
});

export type SalesSummary = z.infer<typeof SalesSummarySchema>;

export const TimeSeriesDataSchema = z.object({
  date: z.string(),
  sales: z.number(),
  transactions: z.number(),
});

export type TimeSeriesData = z.infer<typeof TimeSeriesDataSchema>;

export const PlatformAnalysisSchema = z.object({
  platform: z.string(),
  sales: z.number(),
  transactions: z.number(),
  averageOrderValue: z.number(),
  uniqueCustomers: z.number(),
});

export type PlatformAnalysis = z.infer<typeof PlatformAnalysisSchema>;

export const CustomerAnalysisSchema = z.object({
  ageGroup: z.string(),
  gender: z.string(),
  sales: z.number(),
  transactions: z.number(),
  averageOrderValue: z.number(),
});

export type CustomerAnalysis = z.infer<typeof CustomerAnalysisSchema>;

export const ProductAnalysisSchema = z.object({
  productName: z.string(),
  category: z.string(),
  sales: z.number(),
  transactions: z.number(),
  averageOrderValue: z.number(),
});

export type ProductAnalysis = z.infer<typeof ProductAnalysisSchema>;

export const PrefectureAnalysisSchema = z.object({
  prefecture: z.string(),
  sales: z.number(),
  transactions: z.number(),
  averageOrderValue: z.number(),
});

export type PrefectureAnalysis = z.infer<typeof PrefectureAnalysisSchema>;

export const CategoryAnalysisSchema = z.object({
  category: z.string(),
  sales: z.number(),
  transactions: z.number(),
  averageOrderValue: z.number(),
  percentage: z.number(),
});

export type CategoryAnalysis = z.infer<typeof CategoryAnalysisSchema>; 