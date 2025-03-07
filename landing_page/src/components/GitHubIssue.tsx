import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { githubService } from '../services/github';

interface GitHubIssueProps {
  repoName: string;
}

export const GitHubIssue: React.FC<GitHubIssueProps> = ({ repoName }) => {
  const [issueTitle, setIssueTitle] = useState('');
  const [issueBody, setIssueBody] = useState('');
  const [issueNumber, setIssueNumber] = useState<number>(0);
  const [isUpdate, setIsUpdate] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoName) return;

    const [owner, repo] = repoName.split('/');
    
    try {
      if (isUpdate) {
        await githubService.updateIssue(owner, repo, issueNumber, issueTitle, issueBody);
      } else {
        await githubService.createIssue(owner, repo, issueTitle, issueBody);
      }
      setIssueTitle('');
      setIssueBody('');
      setIssueNumber(0);
    } catch (error) {
      console.error('Error managing issue:', error);
    }
  };

  const handleDelete = async () => {
    if (!repoName || !issueNumber) return;

    const [owner, repo] = repoName.split('/');
    try {
      await githubService.closeIssue(owner, repo, issueNumber);
      setIssueNumber(0);
    } catch (error) {
      console.error('Error closing issue:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gray-800 rounded-lg p-6"
    >
      <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
        {isUpdate ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        {isUpdate ? 'Update Issue' : 'Create Issue'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isUpdate && (
          <input
            type="number"
            value={issueNumber}
            onChange={(e) => setIssueNumber(Number(e.target.value))}
            placeholder="Issue Number"
            className="w-full bg-gray-700 rounded px-4 py-2 text-white"
          />
        )}
        <input
          type="text"
          value={issueTitle}
          onChange={(e) => setIssueTitle(e.target.value)}
          placeholder="Issue Title"
          className="w-full bg-gray-700 rounded px-4 py-2 text-white"
        />
        <textarea
          value={issueBody}
          onChange={(e) => setIssueBody(e.target.value)}
          placeholder="Issue Description"
          className="w-full bg-gray-700 rounded px-4 py-2 text-white h-32 resize-none"
        />
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-white flex-1"
          >
            {isUpdate ? 'Update Issue' : 'Create Issue'}
          </button>
          {isUpdate && (
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>

      <button
        onClick={() => setIsUpdate(!isUpdate)}
        className="text-purple-400 hover:text-purple-300 text-sm mt-4"
      >
        {isUpdate ? 'Switch to Create' : 'Switch to Update'}
      </button>
    </motion.div>
  );
};