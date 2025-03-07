import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: import.meta.env.VITE_GITHUB_TOKEN
});

export async function fetchGitHubStats(owner: string, repo: string) {
  if (!owner || !repo) {
    throw new Error('Owner and repository name are required');
  }

  try {
    const [issues, prs] = await Promise.all([
      octokit.rest.issues.listForRepo({
        owner,
        repo,
        state: 'all',
        per_page: 100
      }),
      octokit.rest.pulls.list({
        owner,
        repo,
        state: 'all',
        per_page: 100
      })
    ]);

    const activeIssues = issues.data.filter(issue => !issue.pull_request && issue.state === 'open').length;
    const closedIssues = issues.data.filter(issue => !issue.pull_request && issue.state === 'closed').length;
    const openPRs = prs.data.filter(pr => pr.state === 'open').length;
    const mergedPRs = prs.data.filter(pr => pr.merged_at !== null).length;

    // Calculate project status based on issues and PRs
    const total = activeIssues + closedIssues || 1; // Prevent division by zero
    const totalPRs = openPRs + mergedPRs || 1; // Prevent division by zero

    const projectStatus = {
      inProgress: Math.round((activeIssues / total) * 100),
      completed: Math.round((closedIssues / total) * 100),
      onHold: Math.round((openPRs / totalPRs) * 100),
      delayed: Math.round((mergedPRs / totalPRs) * 100)
    };

    return {
      stats: {
        activeIssues,
        closedIssues,
        openPRs,
        mergedPRs
      },
      projectStatus
    };
  } catch (error) {
    console.error('Error fetching GitHub data:', error);
    throw error;
  }
}