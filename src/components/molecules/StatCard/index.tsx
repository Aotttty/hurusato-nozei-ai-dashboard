import { LucideIcon } from "lucide-react";
import { cn } from "@/libraries/css";
import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
  };
  icon?: LucideIcon | React.ReactElement;
  iconColor?: string;
  dataTestId?: string;
}

export function StatCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  iconColor = "text-blue-600",
  dataTestId 
}: StatCardProps) {
  return (
    <div 
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300"
      data-testid={dataTestId}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1" data-testid={`${dataTestId}-title`}>
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 mb-2" data-testid={`${dataTestId}-value`}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {change && (
            <div className="flex items-center">
              <span
                className={cn(
                  "text-sm font-medium",
                  change.isPositive ? "text-green-600" : "text-red-600"
                )}
                data-testid={`${dataTestId}-change`}
              >
                {change.isPositive ? "+" : ""}{change.value}%
              </span>
              <span className="text-sm text-gray-500 ml-1">
                前月比
              </span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={cn("p-3 rounded-full bg-gray-50", iconColor)} data-testid={`${dataTestId}-icon`}>
            {React.isValidElement(Icon) ? Icon : <Icon className="h-6 w-6" />}
          </div>
        )}
      </div>
    </div>
  );
} 