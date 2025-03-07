import { jsPDF } from 'jspdf';
import { GitHubLog } from '../services/github';
import { format } from 'date-fns';

export const generateActivityLogPDF = (logs: GitHubLog[]) => {
  const doc = new jsPDF();
  let yPos = 20;

  // Add title
  doc.setFontSize(16);
  doc.text('GitHub Activity Log', 20, yPos);
  yPos += 10;

  // Add content
  doc.setFontSize(12);
  logs.forEach((log) => {
    if (yPos > 280) {
      doc.addPage();
      yPos = 20;
    }

    const timestamp = format(new Date(log.timestamp), 'MMM d, yyyy HH:mm');
    const text = `${timestamp} - ${log.actor} ${log.action} ${log.type} "${log.title}"`;
    
    doc.text(text, 20, yPos, { maxWidth: 170 });
    yPos += 10;
  });

  // Save the PDF
  doc.save('github-activity-log.pdf');
};