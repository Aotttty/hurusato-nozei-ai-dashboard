import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { DashboardFilters } from "@/components/molecules/DashboardFilters";
import DashboardOverview from "@/components/organisms/DashboardOverview";
import { ChatbotPopup } from "@/components/molecules/ChatbotPopup";
import { getPlatformsAction } from "./actions";

interface DashboardPageProps {
  searchParams?: Promise<{
    period?: string;
    startDate?: string;
    endDate?: string;
    platforms?: string;
    ageGroups?: string;
    genders?: string;
  }>;
}

async function DashboardFiltersWrapper() {
  const platforms = await getPlatformsAction();
  return <DashboardFilters platforms={platforms} />;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const t = await getTranslations("Dashboard");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900" data-testid="dashboard-title">
            {t("title")}
          </h1>
          <p className="mt-2 text-lg text-gray-600" data-testid="dashboard-subtitle">
            {t("subtitle")}
          </p>
        </div>

        {/* フィルター */}
        <div className="mb-8">
          <Suspense fallback={<div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-8 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>}>
            <DashboardFiltersWrapper />
          </Suspense>
        </div>

        {/* ダッシュボードコンテンツ */}
        <DashboardOverview searchParams={searchParams} />
      </div>

      {/* チャットボットポップアップ */}
      <ChatbotPopup />
    </div>
  );
}
