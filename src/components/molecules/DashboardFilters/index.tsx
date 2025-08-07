'use client';

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/atoms/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/atoms/select";
import { Calendar } from "@/components/atoms/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/atoms/popover";
import { Badge } from "@/components/atoms/badge";
import { CalendarIcon, RefreshCwIcon, XIcon } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

interface Platform {
  id: string;
  name: string;
}

interface DashboardFiltersProps {
  platforms?: Platform[];
}

export function DashboardFilters({ platforms = [] }: DashboardFiltersProps) {
  const t = useTranslations("Dashboard.Filters");
  const router = useRouter();
  const searchParams = useSearchParams();

  const [period, setPeriod] = useState(searchParams.get('period') || 'monthly');
  const [startDate, setStartDate] = useState<Date | undefined>(
    searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined
  );
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(
    searchParams.get('platforms')?.split(',').filter(Boolean) || []
  );
  const [selectedAgeGroups, setSelectedAgeGroups] = useState<string[]>(
    searchParams.get('ageGroups')?.split(',').filter(Boolean) || []
  );
  const [selectedGenders, setSelectedGenders] = useState<string[]>(
    searchParams.get('genders')?.split(',').filter(Boolean) || []
  );

  const updateURLParams = useCallback(() => {
    const params = new URLSearchParams();
    
    if (period) params.set('period', period);
    if (startDate) params.set('startDate', format(startDate, 'yyyy-MM-dd'));
    if (endDate) params.set('endDate', format(endDate, 'yyyy-MM-dd'));
    if (selectedPlatforms.length > 0) params.set('platforms', selectedPlatforms.join(','));
    if (selectedAgeGroups.length > 0) params.set('ageGroups', selectedAgeGroups.join(','));
    if (selectedGenders.length > 0) params.set('genders', selectedGenders.join(','));

    const newURL = `/dashboard?${params.toString()}`;
    router.push(newURL);
  }, [period, startDate, endDate, selectedPlatforms, selectedAgeGroups, selectedGenders, router]);

  useEffect(() => {
    updateURLParams();
  }, [updateURLParams]);

  const resetFilters = () => {
    setPeriod('monthly');
    setStartDate(undefined);
    setEndDate(undefined);
    setSelectedPlatforms([]);
    setSelectedAgeGroups([]);
    setSelectedGenders([]);
  };

  const handleMultiSelect = (currentValues: string[], newValue: string, setter: (values: string[]) => void) => {
    if (currentValues.includes(newValue)) {
      setter(currentValues.filter(value => value !== newValue));
    } else {
      setter([...currentValues, newValue]);
    }
  };

  const removeSelectedItem = (item: string, setter: (values: string[]) => void, currentValues: string[]) => {
    setter(currentValues.filter(value => value !== item));
  };

  const ageGroupOptions = [
    { value: '20代', label: '20代' },
    { value: '30代', label: '30代' },
    { value: '40代', label: '40代' },
    { value: '50代', label: '50代' },
    { value: '60代', label: '60代' },
    { value: '70代以上', label: '70代以上' },
  ];

  const genderOptions = [
    { value: '男性', label: '男性' },
    { value: '女性', label: '女性' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200" data-testid="dashboard-filters">
      <div className="space-y-4">
        {/* 基本フィルター */}
        <div className="flex flex-wrap items-center gap-4">
          {/* 期間フィルター */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">{t("period")}:</span>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">{t("daily")}</SelectItem>
                <SelectItem value="weekly">{t("weekly")}</SelectItem>
                <SelectItem value="monthly">{t("monthly")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 日付範囲フィルター */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">{t("dateRange")}:</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-40 justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, 'yyyy/MM/dd', { locale: ja }) : t("selectStartDate")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <span className="text-gray-500">-</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-40 justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, 'yyyy/MM/dd', { locale: ja }) : t("selectEndDate")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* リセットボタン */}
          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
            className="ml-auto"
            data-testid="reset-filters-button"
          >
            <RefreshCwIcon className="mr-2 h-4 w-4" />
            {t("reset")}
          </Button>
        </div>

        {/* 複数選択フィルター */}
        <div className="space-y-3">
          {/* プラットフォームフィルター */}
          <div className="flex items-start gap-2">
            <span className="text-sm font-medium text-gray-700 min-w-[80px] mt-2">{t("platforms")}:</span>
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-2">
                {platforms.map((platform) => (
                  <Button
                    key={platform.id}
                    variant={selectedPlatforms.includes(platform.name) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleMultiSelect(selectedPlatforms, platform.name, setSelectedPlatforms)}
                    data-testid={`platform-${platform.name}`}
                  >
                    {platform.name}
                  </Button>
                ))}
              </div>
              {selectedPlatforms.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedPlatforms.map((platform) => (
                    <Badge key={platform} variant="secondary" className="gap-1">
                      {platform}
                      <button
                        onClick={() => removeSelectedItem(platform, setSelectedPlatforms, selectedPlatforms)}
                        className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                        data-testid={`remove-platform-${platform}`}
                      >
                        <XIcon className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 年代フィルター */}
          <div className="flex items-start gap-2">
            <span className="text-sm font-medium text-gray-700 min-w-[80px] mt-2">{t("ageGroups")}:</span>
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-2">
                {ageGroupOptions.map((ageGroup) => (
                  <Button
                    key={ageGroup.value}
                    variant={selectedAgeGroups.includes(ageGroup.value) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleMultiSelect(selectedAgeGroups, ageGroup.value, setSelectedAgeGroups)}
                    data-testid={`age-group-${ageGroup.value}`}
                  >
                    {ageGroup.label}
                  </Button>
                ))}
              </div>
              {selectedAgeGroups.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedAgeGroups.map((ageGroup) => (
                    <Badge key={ageGroup} variant="secondary" className="gap-1">
                      {ageGroup}
                      <button
                        onClick={() => removeSelectedItem(ageGroup, setSelectedAgeGroups, selectedAgeGroups)}
                        className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                        data-testid={`remove-age-group-${ageGroup}`}
                      >
                        <XIcon className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 性別フィルター */}
          <div className="flex items-start gap-2">
            <span className="text-sm font-medium text-gray-700 min-w-[80px] mt-2">{t("genders")}:</span>
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-2">
                {genderOptions.map((gender) => (
                  <Button
                    key={gender.value}
                    variant={selectedGenders.includes(gender.value) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleMultiSelect(selectedGenders, gender.value, setSelectedGenders)}
                    data-testid={`gender-${gender.value}`}
                  >
                    {gender.label}
                  </Button>
                ))}
              </div>
              {selectedGenders.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedGenders.map((gender) => (
                    <Badge key={gender} variant="secondary" className="gap-1">
                      {gender}
                      <button
                        onClick={() => removeSelectedItem(gender, setSelectedGenders, selectedGenders)}
                        className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                        data-testid={`remove-gender-${gender}`}
                      >
                        <XIcon className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 