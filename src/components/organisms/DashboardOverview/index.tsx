import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { StatCard } from "@/components/molecules/StatCard";
import { SalesChart } from "@/components/molecules/SalesChart";
import { DataTable } from "@/components/molecules/DataTable";
import { 
  getSalesSummaryAction, 
  getTimeSeriesDataAction, 
  getPlatformAnalysisAction, 
  getCustomerAnalysisAction, 
  getProductAnalysisAction, 
  getPrefectureAnalysisAction,
  getCategoryAnalysisAction
} from "@/app/(site)/(authorized)/(app)/dashboard/actions";
import { 
  TrendingUpIcon, 
  ShoppingCartIcon, 
  UsersIcon, 
  DollarSignIcon 
} from "lucide-react";

interface DashboardOverviewProps {
  searchParams?: Promise<{
    period?: string;
    startDate?: string;
    endDate?: string;
    platforms?: string;
    ageGroups?: string;
    genders?: string;
  }>;
}

async function DashboardStats({ searchParams }: { searchParams?: DashboardOverviewProps['searchParams'] }) {
  const t = await getTranslations("Dashboard.Stats");
  const params = await searchParams;

  const platforms = params?.platforms?.split(',').filter(Boolean);
  const ageGroups = params?.ageGroups?.split(',').filter(Boolean);
  const genders = params?.genders?.split(',').filter(Boolean);

  const salesSummary = await getSalesSummaryAction(
    params?.startDate, 
    params?.endDate, 
    platforms, 
    ageGroups, 
    genders
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="dashboard-stats">
      <StatCard
        title={t("totalSales")}
        value={`¥${salesSummary.totalSales.toLocaleString()}`}
        change={{ value: 12.5, isPositive: true }}
        icon={TrendingUpIcon}
        iconColor="text-blue-600"
        dataTestId="total-sales-card"
      />
      <StatCard
        title={t("totalTransactions")}
        value={salesSummary.totalTransactions.toLocaleString()}
        change={{ value: 8.2, isPositive: true }}
        icon={ShoppingCartIcon}
        iconColor="text-green-600"
        dataTestId="total-transactions-card"
      />
      <StatCard
        title={t("uniqueCustomers")}
        value={salesSummary.uniqueCustomers.toLocaleString()}
        change={{ value: 15.3, isPositive: true }}
        icon={UsersIcon}
        iconColor="text-purple-600"
        dataTestId="unique-customers-card"
      />
      <StatCard
        title={t("averageOrderValue")}
        value={`¥${salesSummary.averageOrderValue.toLocaleString()}`}
        change={{ value: 5.7, isPositive: true }}
        icon={DollarSignIcon}
        iconColor="text-orange-600"
        dataTestId="average-order-value-card"
      />
    </div>
  );
}

async function DashboardCharts({ searchParams }: { searchParams?: DashboardOverviewProps['searchParams'] }) {
  const t = await getTranslations("Dashboard.Charts");
  const params = await searchParams;
  
  // フィルターパラメータを配列に変換
  const platforms = params?.platforms?.split(',').filter(Boolean);
  const ageGroups = params?.ageGroups?.split(',').filter(Boolean);
  const genders = params?.genders?.split(',').filter(Boolean);

  const [timeSeriesData, platformAnalysis, customerAnalysis, categoryAnalysis] = await Promise.all([
    getTimeSeriesDataAction(params?.startDate, params?.endDate),
    getPlatformAnalysisAction(params?.startDate, params?.endDate, platforms, ageGroups, genders),
    getCustomerAnalysisAction(params?.startDate, params?.endDate, platforms, ageGroups, genders),
    getCategoryAnalysisAction(params?.startDate, params?.endDate, platforms, ageGroups, genders),
  ]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-testid="dashboard-charts">
      <SalesChart
        type="line"
        title={t("salesTrend")}
        data={timeSeriesData}
        dataTestId="sales-trend-chart"
      />
      <SalesChart
        type="bar"
        title={t("platformComparison")}
        data={platformAnalysis}
        dataTestId="platform-comparison-chart"
      />
      <SalesChart
        type="doughnut"
        title={t("categoryDistribution")}
        data={categoryAnalysis}
        dataTestId="category-distribution-chart"
      />
      <SalesChart
        type="doughnut"
        title={t("genderDistribution")}
        data={customerAnalysis}
        dataTestId="gender-distribution-chart"
      />
    </div>
  );
}

async function DashboardTables({ searchParams }: { searchParams?: DashboardOverviewProps['searchParams'] }) {
  const t = await getTranslations("Dashboard.Tables");
  const params = await searchParams;
  
  // フィルターパラメータを配列に変換
  const platforms = params?.platforms?.split(',').filter(Boolean);
  const ageGroups = params?.ageGroups?.split(',').filter(Boolean);
  const genders = params?.genders?.split(',').filter(Boolean);

  const [productAnalysis, prefectureAnalysis] = await Promise.all([
    getProductAnalysisAction(params?.startDate, params?.endDate, platforms, ageGroups, genders),
    getPrefectureAnalysisAction(params?.startDate, params?.endDate, platforms, ageGroups, genders),
  ]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <DataTable
        title={t("productRanking")}
        data={productAnalysis}
        type="product"
        dataTestId="product-ranking-table"
      />
      <DataTable
        title={t("prefectureRanking")}
        data={prefectureAnalysis}
        type="prefecture"
        dataTestId="prefecture-ranking-table"
      />
    </div>
  );
}

export default function DashboardOverview({ searchParams }: DashboardOverviewProps) {
  return (
    <div className="space-y-8">
      <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>}>
        <DashboardStats searchParams={searchParams} />
      </Suspense>

      <Suspense fallback={<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>}>
        <DashboardCharts searchParams={searchParams} />
      </Suspense>

      <Suspense fallback={<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="space-y-2">
              {[...Array(5)].map((_, j) => (
                <div key={j} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ))}
      </div>}>
        <DashboardTables searchParams={searchParams} />
      </Suspense>
    </div>
  );
} 