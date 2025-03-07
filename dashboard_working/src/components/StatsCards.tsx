import React from 'react';
import { MonitorPlay, CheckSquare, FileText, GitPullRequest } from 'lucide-react';

interface StatsCardsProps {
  activeIssues: number;
  closedIssues: number;
  openPRs: number;
  mergedPRs: number;
}

export const StatsCards = ({ activeIssues, closedIssues, openPRs, mergedPRs }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-4 gap-6">
      <StatCard
        icon={<FileText className="w-6 h-6" />}
        label="Active Issues"
        value={activeIssues.toString()}
      />
      <StatCard
        icon={<CheckSquare className="w-6 h-6" />}
        label="Closed Issues"
        value={closedIssues.toString()}
      />
      <StatCard
        icon={<GitPullRequest className="w-6 h-6" />}
        label="Open PRs"
        value={openPRs.toString()}
      />
      <StatCard
        icon={<CheckSquare className="w-6 h-6" />}
        label="Merged PRs"
        value={mergedPRs.toString()}
      />
    </div>
  );
};

const StatCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg flex items-center space-x-4">
      {icon}
      <div>
        <p className="text-2xl font-semibold">{value}</p>
        <p className="text-sm text-gray-600">{label}</p>
      </div>
    </div>
  );
};