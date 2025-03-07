import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Download, FileText, MessageSquare, GitPullRequest, FileCode } from 'lucide-react';
import { format } from 'date-fns';
import { generateActivityLogPDF } from '../utils/pdf';
import { FileUpload } from './FileUpload';
import { Task } from '../types';

interface ActivityLogProps {
  repoName: string;
  logs: any[];
  tasks: Task[];
  onFileUpload: (data: any) => void;
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ repoName, logs, tasks, onFileUpload }) => {
  const totalEvents = logs.length + tasks.length;

  const getTaskIcon = (type: Task['type']) => {
    switch (type) {
      case 'slack':
        return <MessageSquare className="w-5 h-5 text-blue-400" />;
      case 'docs':
        return <FileCode className="w-5 h-5 text-green-400" />;
      case 'notes':
        return <FileText className="w-5 h-5 text-purple-400" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  const getTaskColor = (type: Task['type']) => {
    switch (type) {
      case 'slack':
        return 'bg-blue-900/20 border-l-4 border-blue-500';
      case 'docs':
        return 'bg-green-900/20 border-l-4 border-green-500';
      case 'notes':
        return 'bg-purple-900/20 border-l-4 border-purple-500';
      default:
        return 'bg-gray-900/20';
    }
  };

  const getLogColor = (type: string) => {
    if (type === 'issue') {
      return 'bg-blue-900/20 border-l-4 border-blue-500';
    }
    if (type === 'pull') {
      return 'bg-purple-900/20 border-l-4 border-purple-500';
    }
    return 'bg-gray-900/20';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gray-800 rounded-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-purple-500" />
          <h2 className="text-xl font-bold">Activity Log</h2>
          {totalEvents > 0 && (
            <span className="text-sm text-gray-400">{totalEvents} events</span>
          )}
        </div>
        {totalEvents > 0 && (
          <button
            onClick={() => generateActivityLogPDF([...logs, ...tasks])}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        )}
      </div>

      <div className="space-y-4">
        {(!repoName && tasks.length === 0) && (
          <div className="mb-6">
            <FileUpload onFileUpload={onFileUpload} />
          </div>
        )}

        <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
          {/* GitHub Logs */}
          {logs.map((log, index) => (
            <motion.div
              key={`github-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 rounded-lg ${getLogColor(log.type)}`}
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold text-purple-300">{log.actor}</span>
                <span className="text-gray-400">{log.action}</span>
                <span className="font-medium text-white">{log.title}</span>
              </div>
              <div className="text-sm text-gray-400 mt-2">
                {format(new Date(log.timestamp), 'MMM d, yyyy, h:mm a')}
              </div>
            </motion.div>
          ))}

          {/* Processed Tasks */}
          {tasks.map((task, index) => (
            <motion.div
              key={`task-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (logs.length + index) * 0.05 }}
              className={`p-4 rounded-lg ${getTaskColor(task.type)}`}
            >
              <div className="flex items-center gap-2">
                {getTaskIcon(task.type)}
                <div className="flex-1">
                  <h3 className="font-medium text-white">{task.title}</h3>
                  <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                    {task.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2 text-sm text-gray-400">
                <span>{format(new Date(task.created_at), 'MMM d, yyyy')}</span>
                {task.assignee && (
                  <span className="text-purple-300">Assigned to: {task.assignee}</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};