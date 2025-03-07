import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: import.meta.env.VITE_GITHUB_TOKEN
});

export interface GitHubLog {
  type: 'issue' | 'repo' | 'pull';
  actor: string;
  action: string;
  issue: string | number;
  title: string;
  timestamp: string;
}

export interface RepoStats {
  stars: number;
  forks: number;
  openIssues: number;
  commitActivity: { week: string; count: number }[];
  recentIssues: {
    number: number;
    title: string;
    body: string;
    state: string;
    created_at: string;
  }[];
  recentWorkflows: {
    name: string;
    status: string;
    conclusion: string;
    started_at: string;
  }[];
}

const validateRepoName = (owner: string, repo: string): boolean => {
  if (!owner || !repo) {
    throw new Error('Invalid repository format. Please use "owner/repo"');
  }
  if (!/^[\w.-]+$/.test(owner) || !/^[\w.-]+$/.test(repo)) {
    throw new Error('Invalid repository name format');
  }
  return true;
};

const handleGitHubError = (error: any): never => {
  if (error.status === 404) {
    throw new Error('Repository not found. Please check the repository name.');
  }
  if (error.status === 401) {
    throw new Error('Authentication failed. Please check your GitHub token.');
  }
  if (error.status === 403) {
    throw new Error('API rate limit exceeded. Please try again later.');
  }
  throw new Error(error.message || 'An error occurred while fetching repository data');
};

export const fetchRepoStats = async (owner: string, repo: string): Promise<RepoStats> => {
  try {
    validateRepoName(owner, repo);

    const [repoData, commitActivity, issues, workflows] = await Promise.all([
      octokit.repos.get({ owner, repo }),
      octokit.repos.getCommitActivityStats({ owner, repo }).catch(() => ({ data: [] })),
      octokit.issues.listForRepo({ owner, repo, state: 'all', per_page: 5 }),
      octokit.actions.listWorkflowRunsForRepo({ owner, repo, per_page: 5 }).catch(() => ({ data: { workflow_runs: [] } }))
    ]);

    return {
      stars: repoData.data.stargazers_count,
      forks: repoData.data.forks_count,
      openIssues: repoData.data.open_issues_count,
      commitActivity: (commitActivity.data || []).slice(-12).map(week => ({
        week: new Date(week.week * 1000).toISOString(),
        count: week.total
      })),
      recentIssues: issues.data.map(issue => ({
        number: issue.number,
        title: issue.title,
        body: issue.body || '',
        state: issue.state,
        created_at: issue.created_at
      })),
      recentWorkflows: workflows.data.workflow_runs.map(run => ({
        name: run.name,
        status: run.status,
        conclusion: run.conclusion || 'pending',
        started_at: run.started_at
      }))
    };
  } catch (error: any) {
    console.error('Error fetching repo stats:', error);
    return handleGitHubError(error);
  }
};

export const fetchRepoLogs = async (owner: string, repo: string): Promise<GitHubLog[]> => {
  try {
    validateRepoName(owner, repo);

    const [issues, pulls] = await Promise.all([
      octokit.issues.listForRepo({
        owner,
        repo,
        state: 'all',
        per_page: 100,
        sort: 'created',
        direction: 'desc'
      }),
      octokit.pulls.list({
        owner,
        repo,
        state: 'all',
        per_page: 100,
        sort: 'created',
        direction: 'desc'
      })
    ]);

    const logs: GitHubLog[] = [];

    issues.data.forEach(issue => {
      if (!issue.pull_request) { // Skip pull requests from issues API
        logs.push({
          type: 'issue',
          actor: issue.user?.login || 'unknown',
          action: issue.state === 'open' ? 'opened' : 'closed',
          issue: issue.number,
          title: issue.title,
          timestamp: issue.created_at,
        });
      }
    });

    pulls.data.forEach(pull => {
      logs.push({
        type: 'pull',
        actor: pull.user?.login || 'unknown',
        action: pull.merged ? 'merged' : pull.state,
        issue: pull.number,
        title: pull.title,
        timestamp: pull.created_at,
      });
    });

    return logs.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  } catch (error: any) {
    console.error('Error fetching GitHub logs:', error);
    return handleGitHubError(error);
  }
};

export const githubService = {
  createIssue: async (owner: string, repo: string, title: string, body: string) => {
    try {
      validateRepoName(owner, repo);
      const { data } = await octokit.issues.create({ owner, repo, title, body });
      return data;
    } catch (error: any) {
      console.error('Error creating issue:', error);
      return handleGitHubError(error);
    }
  },

  updateIssue: async (owner: string, repo: string, issue_number: number, title: string, body: string) => {
    try {
      validateRepoName(owner, repo);
      const { data } = await octokit.issues.update({ owner, repo, issue_number, title, body });
      return data;
    } catch (error: any) {
      console.error('Error updating issue:', error);
      return handleGitHubError(error);
    }
  },

  closeIssue: async (owner: string, repo: string, issue_number: number) => {
    try {
      validateRepoName(owner, repo);
      const { data } = await octokit.issues.update({ owner, repo, issue_number, state: 'closed' });
      return data;
    } catch (error: any) {
      console.error('Error closing issue:', error);
      return handleGitHubError(error);
    }
  }
};