import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import 'jspdf-autotable';

interface ActivityLog {
  id: string;
  type: string;
  title: string;
  user: string;
  date: string;
  action: string;
}

export const generateActivityLogPDF = (logs: ActivityLog[]) => {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(20);
  doc.setTextColor(88, 28, 135); // Purple color
  doc.text('GitHub Activity Log', 15, 20);

  // Add timestamp
  doc.setFontSize(10);
  doc.setTextColor(128, 128, 128); // Gray color
  doc.text(`Generated on ${format(new Date(), 'PPpp')}`, 15, 30);

  // Create table
  doc.autoTable({
    startY: 40,
    head: [['Date', 'User', 'Type', 'Action', 'Title']],
    body: logs.map(log => [
      format(new Date(log.date), 'MMM d, yyyy HH:mm'),
      log.user,
      log.type,
      log.action,
      log.title
    ]),
    theme: 'striped',
    headStyles: {
      fillColor: [88, 28, 135],
      textColor: 255,
      fontSize: 12,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 10
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250]
    }
  });

  // Save the PDF
  doc.save('github-activity-log.pdf');
};