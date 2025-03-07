export interface SlackMessage {
  user: string;
  text: string;
  timestamp: string;
  team: string;
}

export interface NoteTakerNote {
  note_id: string;
  content: string;
  created_at: string;
  attendees: string[];
  status: string;
}

export interface ProcessedData {
  slack_messages: SlackMessage[];
  google_docs_content: string[];
  note_taker_notes: NoteTakerNote[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: 'slack' | 'docs' | 'notes';
  priority: 'high' | 'medium' | 'low';
  status: string;
  assignee?: string;
  created_at: string;
}