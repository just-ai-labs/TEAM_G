import React from 'react';
import { motion } from 'framer-motion';
import { Star, GitFork, AlertCircle, Activity, GitPullRequest, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { RepoStats } from '../services/github';

interface TaskDetailsProps {
  stats: RepoStats | null;
  loading: boolean;
}

export const TaskDetails: React.FC<TaskDetailsProps> = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-700 rounded w-1/4"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-24 bg-gray-700 rounded"></div>
            <div className="h-24 bg-gray-700 rounded"></div>
            <div className="h-24 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gray-800 rounded-lg p-6"
    >
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Activity className="w-6 h-6 text-purple-500" />
        Repository Overview
      </h2>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-700/50 rounded-lg p-4">
          <div className="flex items-center gap-2 text-yellow-400 mb-2">
            <Star className="w-5 h-5" />
            <span className="font-semibold">Stars</span>
          </div>
          <span className="text-2xl font-bold">{stats.stars.toLocaleString()}</span>
        </div>

        <div className="bg-gray-700/50 rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-400 mb-2">
            <GitFork className="w-5 h-5" />
            <span className="font-semibold">Forks</span>
          </div>
          <span className="text-2xl font-bold">{stats.forks.toLocaleString()}</span>
        </div>

        <div className="bg-gray-700/50 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-400 mb-2">
            <AlertCircle className="w-5 h-5" />
            <span className="font-semibold">Open Issues</span>
          </div>
          <span className="text-2xl font-bold">{stats.openIssues.toLocaleString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Recent Issues</h3>
          <div className="space-y-3">
            {stats.recentIssues.map((issue) => (
              <div key={issue.number} className="bg-gray-700/50 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <GitPullRequest className="w-4 h-4 text-purple-400" />
                  <span className="font-medium">#{issue.number}</span>
                  <span className="text-sm">{issue.title}</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {format(new Date(issue.created_at), 'MMM d, yyyy')}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Recent Workflows</h3>
          <div className="space-y-3">
            {stats.recentWorkflows.map((workflow, index) => (
              <div key={index} className="bg-gray-700/50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {workflow.conclusion === 'success' ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : workflow.conclusion === 'failure' ? (
                      <XCircle className="w-4 h-4 text-red-400" />
                    ) : (
                      <Activity className="w-4 h-4 text-yellow-400" />
                    )}
                    <span className="text-sm">{workflow.name}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {format(new Date(workflow.started_at), 'MMM d, HH:mm')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};