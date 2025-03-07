import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GitPullRequest } from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { TaskList } from './components/TaskList';
import { TaskModal } from './components/TaskModal';
import { GitHubIssue } from './components/GitHubIssue';
import { ChatAssistant } from './components/ChatAssistant';
import { ActivityLog } from './components/ActivityLog';
import { TaskDetails } from './components/TaskDetails';
import LandingPage from './pages/LandingPage';
import { Task } from './types';
import { processRawData, generateTasks } from './utils/processData';
import { fetchRepoStats, fetchRepoLogs, RepoStats } from './services/github';

function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [repoName, setRepoName] = useState('');
  const [activeSection, setActiveSection] = useState<'activityLog' | 'issueManagement' | 'processTask' | 'taskDetails'>('activityLog');
  const [repoStats, setRepoStats] = useState<RepoStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);

  const handleFileUpload = (rawData: any) => {
    const processedData = processRawData(rawData);
    const generatedTasks = generateTasks(processedData);
    setTasks(generatedTasks);
  };

  const handleLoadRepository = async () => {
    if (!repoName) {
      alert('Please enter a repository name');
      return;
    }
    
    const [owner, repo] = repoName.split('/');
    if (!owner || !repo) {
      alert('Please enter a valid repository name in the format "owner/repo"');
      return;
    }
    
    setLoading(true);
    try {
      const [stats, repoLogs] = await Promise.all([
        fetchRepoStats(owner, repo),
        fetchRepoLogs(owner, repo)
      ]);
      
      setRepoStats(stats);
      setLogs(repoLogs);
      setActiveSection('activityLog');
    } catch (error) {
      console.error('Error loading repository:', error);
      alert(error instanceof Error ? error.message : 'Failed to load repository');
      setRepoStats(null);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-3 mb-8">
          <GitPullRequest className="w-8 h-8 text-purple-500" />
          <h1 className="text-2xl font-bold">GitHub Management System</h1>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="col-span-3">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="mb-4">
                <input
                  type="text"
                  value={repoName}
                  onChange={(e) => setRepoName(e.target.value)}
                  placeholder="owner/repo"
                  className="w-full bg-gray-700 rounded px-4 py-2 mb-4"
                />
                <button 
                  className="w-full bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-white disabled:opacity-50"
                  onClick={handleLoadRepository}
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Load Repository'}
                </button>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => setActiveSection('activityLog')}
                  className={`w-full text-left px-4 py-2 rounded ${
                    activeSection === 'activityLog' ? 'bg-purple-600' : 'hover:bg-gray-700'
                  }`}
                >
                  Activity Log
                </button>
                <button
                  onClick={() => setActiveSection('taskDetails')}
                  className={`w-full text-left px-4 py-2 rounded ${
                    activeSection === 'taskDetails' ? 'bg-purple-600' : 'hover:bg-gray-700'
                  }`}
                >
                  Task Details
                </button>
                <button
                  onClick={() => setActiveSection('issueManagement')}
                  className={`w-full text-left px-4 py-2 rounded ${
                    activeSection === 'issueManagement' ? 'bg-purple-600' : 'hover:bg-gray-700'
                  }`}
                >
                  Issue Management
                </button>
                <button
                  onClick={() => setActiveSection('processTask')}
                  className={`w-full text-left px-4 py-2 rounded ${
                    activeSection === 'processTask' ? 'bg-purple-600' : 'hover:bg-gray-700'
                  }`}
                >
                  Process Task
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            <div className="grid grid-cols-1 gap-6">
              {activeSection === 'processTask' && (
                <div>
                  {tasks.length === 0 ? (
                    <FileUpload onFileUpload={handleFileUpload} />
                  ) : (
                    <TaskList tasks={tasks} onTaskClick={setSelectedTask} />
                  )}
                </div>
              )}

              {activeSection === 'issueManagement' && (
                <GitHubIssue repoName={repoName} />
              )}

              {activeSection === 'activityLog' && (
                <ActivityLog 
                  repoName={repoName} 
                  logs={logs}
                  onFileUpload={handleFileUpload}
                  tasks={tasks}
                />
              )}

              {activeSection === 'taskDetails' && (
                <TaskDetails stats={repoStats} loading={loading} />
              )}

              <ChatAssistant />
            </div>
          </div>
        </div>

        {selectedTask && (
          <TaskModal
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
          />
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;