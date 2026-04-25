import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  trendDirection?: "up" | "down" | "neutral";
}

export default function StatCard({ title, value, icon, trend, trendDirection }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h4 className="text-3xl font-bold text-gray-900 font-playfair">{value}</h4>
        
        {trend && (
          <p className="mt-2 text-sm flex items-center">
            {trendDirection === "up" && (
              <span className="text-green-600 flex items-center font-medium">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                {trend}
              </span>
            )}
            {trendDirection === "down" && (
              <span className="text-red-500 flex items-center font-medium">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                {trend}
              </span>
            )}
            {trendDirection === "neutral" && (
              <span className="text-gray-500 flex items-center font-medium">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" /></svg>
                {trend}
              </span>
            )}
            <span className="text-gray-400 ml-2">vs last month</span>
          </p>
        )}
      </div>
      <div className="w-12 h-12 rounded-full bg-[#FFF7ED] flex items-center justify-center text-[#F97316]">
        {icon}
      </div>
    </div>
  );
}
