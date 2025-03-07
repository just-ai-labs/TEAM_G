export interface GitHubIssue {
  id: number;
  state: string;
  title: string;
  labels: Array<{ name: string }>;
}

export interface GitHubPR {
  id: number;
  state: string;
  title: string;
}

export interface GitHubStats {
  activeIssues: number;
  closedIssues: number;
  openPRs: number;
  mergedPRs: number;
}

export interface ProjectStatus {
  inProgress: number;
  completed: number;
  onHold: number;
  delayed: number;
}