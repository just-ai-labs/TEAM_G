import React, { useEffect, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardHeader } from './components/DashboardHeader';
import { StatsCards } from './components/StatsCards';
import { ProjectStatus } from './components/charts/ProjectStatus';
import { fetchGitHubStats } from './utils/github';
import type { GitHubStats, ProjectStatus as ProjectStatusType } from './types/github';

function App() {
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<GitHubStats>({
    activeIssues: 0,
    closedIssues: 0,
    openPRs: 0,
    mergedPRs: 0
  });
  const [projectStatus, setProjectStatus] = useState<ProjectStatusType>({
    inProgress: 0,
    completed: 0,
    onHold: 0,
    delayed: 0
  });

  const loadGitHubData = async (owner: string, repo: string) => {
    if (!owner || !repo) return;
    
    try {
      setError(null);
      const data = await fetchGitHubStats(owner, repo);
      setStats(data.stats);
      setProjectStatus(data.projectStatus);
    } catch (err) {
      setError('Failed to fetch repository data. Please check the repository details.');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Repository Details</h2>
            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="owner" className="block text-sm font-medium text-gray-700 mb-1">
                  Owner
                </label>
                <input
                  id="owner"
                  type="text"
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g., facebook"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="repo" className="block text-sm font-medium text-gray-700 mb-1">
                  Repository
                </label>
                <input
                  id="repo"
                  type="text"
                  value={repo}
                  onChange={(e) => setRepo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g., react"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => loadGitHubData(owner, repo)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Load Data
                </button>
              </div>
            </div>
            {error && (
              <div className="mt-4 text-red-600 text-sm">
                {error}
              </div>
            )}
          </div>

          <StatsCards
            activeIssues={stats.activeIssues}
            closedIssues={stats.closedIssues}
            openPRs={stats.openPRs}
            mergedPRs={stats.mergedPRs}
          />
          
          <div className="mt-6">
            <ProjectStatus data={projectStatus} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;