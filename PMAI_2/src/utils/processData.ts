import { ProcessedData, Task, SlackMessage, NoteTakerNote } from '../types';

export const processRawData = (rawData: any): ProcessedData => {
  // Process Slack messages
  const slack_messages = (rawData.slack_data?.messages || []).map((msg: any) => ({
    user: msg.user,
    text: msg.text,
    timestamp: new Date(parseInt(msg.ts.split('.')[0]) * 1000).toISOString(),
    team: msg.team,
  }));

  // Process Google Docs content
  const google_docs_content = (rawData.google_docs_data?.body?.content || []).map(
    (item: any) => item.paragraph?.elements[0]?.textRun?.content || ''
  );

  // Process Note Taker notes
  const note_taker_notes = (rawData.note_taker_data?.notes || []).map((note: any) => ({
    note_id: note.id,
    content: note.content,
    created_at: new Date(parseInt(note.timestamp) * 1000).toISOString(),
    attendees: note.metadata?.attendees || [],
    status: note.metadata?.status || 'pending',
  }));

  return {
    slack_messages,
    google_docs_content,
    note_taker_notes,
  };
};

export const generateTasks = (data: ProcessedData): Task[] => {
  const tasks: Task[] = [];

  // Process Slack messages into tasks
  data.slack_messages.forEach((msg, index) => {
    if (msg.text.toLowerCase().includes('sprint') || msg.text.toLowerCase().includes('task')) {
      tasks.push({
        id: `slack-${index}`,
        title: `Sprint Planning Task #${index + 1}`,
        description: msg.text,
        type: 'slack',
        priority: msg.text.toLowerCase().includes('urgent') ? 'high' : 'medium',
        status: 'pending',
        assignee: msg.user,
        created_at: msg.timestamp,
      });
    }
  });

  // Process Google Docs content into team assignments
  data.google_docs_content.forEach((content, index) => {
    if (content.includes('Team')) {
      tasks.push({
        id: `docs-${index}`,
        title: `Team Assignment #${index + 1}`,
        description: content,
        type: 'docs',
        priority: 'high',
        status: 'pending',
        created_at: new Date().toISOString(),
      });
    }
  });

  // Process Notes into tasks
  data.note_taker_notes.forEach((note) => {
    tasks.push({
      id: note.note_id,
      title: `Note Task: ${note.content.slice(0, 50)}...`,
      description: note.content,
      type: 'notes',
      priority: note.status === 'Pending' ? 'high' : 'medium',
      status: note.status,
      assignee: note.attendees[0],
      created_at: note.created_at,
    });
  });

  return tasks;
};