import React, { useState } from 'react';
import { MessageSquare, Send, GitBranch, Calendar, User } from 'lucide-react';

type Message = {
  type: 'bot' | 'user';
  content: string;
};

type AnalysisState = {
  owner: string;
  repo: string;
  days: number;
};

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'bot',
      content: "Hi! I'm your GitHub Commit Analyzer. Let's start by getting the repository owner/organization name.",
    },
  ]);
  const [input, setInput] = useState('');
  const [currentStep, setCurrentStep] = useState<'owner' | 'repo' | 'days' | 'complete'>('owner');
  const [analysis, setAnalysis] = useState<AnalysisState>({
    owner: '',
    repo: '',
    days: 0,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { type: 'user', content: input }]);

    // Update analysis state based on current step
    switch (currentStep) {
      case 'owner':
        setAnalysis((prev) => ({ ...prev, owner: input }));
        setMessages((prev) => [
          ...prev,
          { type: 'bot', content: 'Great! Now, what is the repository name?' },
        ]);
        setCurrentStep('repo');
        break;

      case 'repo':
        setAnalysis((prev) => ({ ...prev, repo: input }));
        setMessages((prev) => [
          ...prev,
          {
            type: 'bot',
            content: 'Perfect! How many days of commit history would you like to analyze?',
          },
        ]);
        setCurrentStep('days');
        break;

      case 'days':
        const days = parseInt(input);
        if (isNaN(days) || days <= 0) {
          setMessages((prev) => [
            ...prev,
            { type: 'bot', content: 'Please enter a valid number of days.' },
          ]);
          break;
        }

        // Update days in analysis state
        const updatedAnalysis = {
          ...analysis,
          days
        };
        setAnalysis(updatedAnalysis);
        setLoading(true);
        setCurrentStep('complete');

        try {
          const response = await fetch('http://localhost:3000/analyze', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              owner: updatedAnalysis.owner,
              repo: updatedAnalysis.repo,
              days: updatedAnalysis.days,
            }),
          });

          const data = await response.json();
          
          if ('error' in data) {
            throw new Error(data.error);
          }

          // Format the analysis results for display
          const formattedResults = `
Analysis Results:
Repository: ${data.repository.owner}/${data.repository.name}
Period: Last ${data.repository.analysis_period_days} days
Commits Analyzed: ${data.commits_analyzed}

Summary:
- Total Additions: ${data.summary.total_additions}
- Total Deletions: ${data.summary.total_deletions}
- Total Files Changed: ${data.summary.total_files_changed}

Detailed Analysis:
${Object.entries(data.analyses).map(([id, analysis]: [string, any]) => `
Commit ${id.slice(0, 7)}:
- Type: ${analysis.type}
- Quality Score: ${analysis.quality_score}/10
- Insights: ${analysis.insights}
`).join('\n')}
`;

          setMessages((prev) => [
            ...prev,
            { type: 'bot', content: formattedResults },
          ]);

          // Reset for new analysis
          setCurrentStep('owner');
          setAnalysis({
            owner: '',
            repo: '',
            days: 0,
          });
        } catch (error) {
          setMessages((prev) => [
            ...prev,
            {
              type: 'bot',
              content: `Error analyzing commits: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ]);
          setCurrentStep('owner');
          setAnalysis({
            owner: '',
            repo: '',
            days: 0,
          });
        } finally {
          setLoading(false);
        }
        break;
    }

    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
        <div className="bg-indigo-600 p-4 flex items-center gap-2">
          <GitBranch className="text-white" size={24} />
          <h1 className="text-xl font-semibold text-white">GitHub Commit Analyzer</h1>
        </div>

        <div className="h-[500px] flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-2 ${
                  message.type === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' ? 'bg-indigo-100' : 'bg-gray-100'
                  }`}
                >
                  {message.type === 'user' ? (
                    <User size={20} className="text-indigo-600" />
                  ) : (
                    <MessageSquare size={20} className="text-gray-600" />
                  )}
                </div>
                <div
                  className={`px-4 py-2 rounded-lg max-w-[80%] ${
                    message.type === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <pre className="whitespace-pre-wrap font-sans">{message.content}</pre>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            )}
          </div>

          <div className="border-t p-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  currentStep === 'owner'
                    ? 'Enter repository owner/organization...'
                    : currentStep === 'repo'
                    ? 'Enter repository name...'
                    : currentStep === 'days'
                    ? 'Enter number of days to analyze...'
                    : 'Analysis complete'
                }
                className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-600"
                disabled={currentStep === 'complete' || loading}
              />
              <button
                onClick={handleSubmit}
                disabled={currentStep === 'complete' || loading || !input.trim()}
                className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;