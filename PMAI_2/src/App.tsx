import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GitPullRequest, ChevronDown } from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { TaskList } from './components/TaskList';
import { TaskModal } from './components/TaskModal';
import { GitHubIssue } from './components/GitHubIssue';
import { ChatAssistant } from './components/ChatAssistant';
import { TaskDetails } from './components/TaskDetails';
import LandingPage from './pages/LandingPage';
import DocumentsPage from './pages/DocumentsPage';
import { Task } from './types';
import { processRawData, generateTasks } from './utils/processData';
import { fetchRepoStats, fetchRepoLogs, RepoStats } from './services/github';
import { getChatResponse } from './services/openai';
import { DocumentProvider } from './context/DocumentContext';

function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [repoName, setRepoName] = useState('');
  const [activeSection, setActiveSection] = useState<'dashboard' | 'issueManagement' | 'processTask' | 'documents'>('dashboard');
  const [repoStats, setRepoStats] = useState<RepoStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [repos, setRepos] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    fetchUserRepos();
  }, []);

  const fetchUserRepos = async () => {
    try {
      const response = await fetch('https://api.github.com/user/repos', {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
        },
      });
      const data = await response.json();
      setRepos(data.map((repo: any) => repo.full_name));
    } catch (error) {
      console.error('Error fetching repos:', error);
    }
  };

  const handleLoadRepository = async () => {
    if (!repoName) {
      alert('Please select a repository');
      return;
    }
    
    const [owner, repo] = repoName.split('/');
    if (!owner || !repo) {
      alert('Please select a valid repository');
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
      setActiveSection('dashboard');
    } catch (error) {
      console.error('Error loading repository:', error);
      alert(error instanceof Error ? error.message : 'Failed to load repository');
      setRepoStats(null);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (rawData: any) => {
    const processedData = processRawData(rawData);
    const generatedTasks = generateTasks(processedData);
    setTasks(generatedTasks);
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
              {/* Unified Repository Selector */}
              <div className="mb-6">
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-full bg-gray-700 rounded px-4 py-2 text-left flex items-center justify-between"
                  >
                    <span>{repoName || 'Select Repository'}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {repos.map((repo) => (
                        <button
                          key={repo}
                          onClick={() => {
                            setRepoName(repo);
                            setDropdownOpen(false);
                            handleLoadRepository();
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-600"
                        >
                          {repo}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setActiveSection('dashboard')}
                  className={`w-full text-left px-4 py-2 rounded ${
                    activeSection === 'dashboard' ? 'bg-purple-600' : 'hover:bg-gray-700'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveSection('documents')}
                  className={`w-full text-left px-4 py-2 rounded ${
                    activeSection === 'documents' ? 'bg-purple-600' : 'hover:bg-gray-700'
                  }`}
                >
                  Documents
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

              {activeSection === 'dashboard' && (
                <TaskDetails stats={repoStats} loading={loading} />
              )}

              {activeSection === 'documents' && (
                <DocumentsPage />
              )}

              <ChatAssistant onSendMessage={getChatResponse} />
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
    <DocumentProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </DocumentProvider>
  );
}

export default App;