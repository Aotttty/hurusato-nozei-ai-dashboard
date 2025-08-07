'use server';

import { SalesDataRepository } from "@/repositories/sales_data_repository";
import { SalesSummary, TimeSeriesData, PlatformAnalysis, CustomerAnalysis, ProductAnalysis, PrefectureAnalysis, CategoryAnalysis, Platform } from "@/models/sales_data";

const salesDataRepository = new SalesDataRepository();

export async function getSalesSummaryAction(
  startDate?: string, 
  endDate?: string, 
  platforms?: string[], 
  ageGroups?: string[], 
  genders?: string[]
): Promise<SalesSummary> {
  try {
    return await salesDataRepository.getSalesSummary(startDate, endDate, platforms, ageGroups, genders);
  } catch (error) {
    console.error('Error fetching sales summary:', error);
    throw new Error('Failed to fetch sales summary');
  }
}

export async function getTimeSeriesDataAction(startDate?: string, endDate?: string): Promise<TimeSeriesData[]> {
  try {
    return await salesDataRepository.getTimeSeriesData(startDate, endDate);
  } catch (error) {
    console.error('Error fetching time series data:', error);
    throw new Error('Failed to fetch time series data');
  }
}

export async function getPlatformsAction(): Promise<Platform[]> {
  try {
    return await salesDataRepository.getPlatforms();
  } catch (error) {
    console.error('Error fetching platforms:', error);
    throw new Error('Failed to fetch platforms');
  }
}

export async function getPlatformAnalysisAction(
  startDate?: string, 
  endDate?: string, 
  platforms?: string[], 
  ageGroups?: string[], 
  genders?: string[]
): Promise<PlatformAnalysis[]> {
  try {
    return await salesDataRepository.getPlatformAnalysis(startDate, endDate, platforms, ageGroups, genders);
  } catch (error) {
    console.error('Error fetching platform analysis:', error);
    throw new Error('Failed to fetch platform analysis');
  }
}

export async function getCustomerAnalysisAction(
  startDate?: string, 
  endDate?: string, 
  platforms?: string[], 
  ageGroups?: string[], 
  genders?: string[]
): Promise<CustomerAnalysis[]> {
  try {
    return await salesDataRepository.getCustomerAnalysis(startDate, endDate, platforms, ageGroups, genders);
  } catch (error) {
    console.error('Error fetching customer analysis:', error);
    throw new Error('Failed to fetch customer analysis');
  }
}

export async function getProductAnalysisAction(
  startDate?: string, 
  endDate?: string, 
  platforms?: string[], 
  ageGroups?: string[], 
  genders?: string[]
): Promise<ProductAnalysis[]> {
  try {
    return await salesDataRepository.getProductAnalysis(startDate, endDate, platforms, ageGroups, genders);
  } catch (error) {
    console.error('Error fetching product analysis:', error);
    throw new Error('Failed to fetch product analysis');
  }
}

export async function getPrefectureAnalysisAction(
  startDate?: string, 
  endDate?: string, 
  platforms?: string[], 
  ageGroups?: string[], 
  genders?: string[]
): Promise<PrefectureAnalysis[]> {
  try {
    return await salesDataRepository.getPrefectureAnalysis(startDate, endDate, platforms, ageGroups, genders);
  } catch (error) {
    console.error('Error fetching prefecture analysis:', error);
    throw new Error('Failed to fetch prefecture analysis');
  }
}

export async function getCategoryAnalysisAction(
  startDate?: string, 
  endDate?: string, 
  platforms?: string[], 
  ageGroups?: string[], 
  genders?: string[]
): Promise<CategoryAnalysis[]> {
  try {
    return await salesDataRepository.getCategoryAnalysis(startDate, endDate, platforms, ageGroups, genders);
  } catch (error) {
    console.error('Error fetching category analysis:', error);
    throw new Error('Failed to fetch category analysis');
  }
}

export async function getLTVAnalysisAction(): Promise<{ repeatRate: number; customerLTV: Array<{ userId: string; totalSpent: number; orderCount: number }> }> {
  try {
    return await salesDataRepository.getLTVAnalysis();
  } catch (error) {
    console.error('Error fetching LTV analysis:', error);
    throw new Error('Failed to fetch LTV analysis');
  }
} 