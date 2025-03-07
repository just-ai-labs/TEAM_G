import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, ChevronDown, GitPullRequest, Users, Clock, Target, GitMerge, Download,
  FileText, Calendar, ChevronLeft, ChevronRight, ArrowLeft, ArrowRight, File
} from 'lucide-react';
import { format, subDays, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { generateActivityLogPDF } from '../utils/pdf';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartDataLabels
);

interface TaskDetailsProps {
  stats: any;
  loading: boolean;
}

const recentDocuments = [
  { name: 'Project Charter.pdf', modified: '2 days ago', type: 'pdf' },
  { name: 'Budget Analysis.xlsx', modified: '3 days ago', type: 'excel' },
  { name: 'Q2 Project Plan.docx', modified: '5 days ago', type: 'word' },
  { name: 'Dashboard.pptx', modified: '1 week ago', type: 'powerpoint' }
];

const upcomingEvents = [
  {
    title: 'Call Meeting with a Client',
    time: '9:00-10:20',
    date: new Date(),
    attendees: ['John D.', 'Sarah M.', 'Mike R.']
  },
  {
    title: 'Technical Planning Session',
    time: '11:00-13:30',
    date: new Date(),
    attendees: ['Alex K.', 'Emma S.', 'Tom B.']
  }
];

export const TaskDetails: React.FC<TaskDetailsProps> = ({ stats, loading }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedRepo, setSelectedRepo] = useState('All Projects');
  const chartsScrollRef = useRef<HTMLDivElement>(null);

  const getDaysInMonth = () => {
    const start = startOfMonth(selectedMonth);
    const end = endOfMonth(selectedMonth);
    return eachDayOfInterval({ start, end });
  };

  const scrollCharts = (direction: 'left' | 'right') => {
    if (chartsScrollRef.current) {
      const scrollAmount = 400;
      chartsScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#fff',
          padding: 20,
          font: { size: 12 }
        }
      },
      datalabels: {
        color: '#fff',
        font: { weight: 'bold' as const }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255,255,255,0.1)' },
        ticks: { color: '#fff' }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#fff' }
      }
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-400" />;
      case 'excel':
        return <FileText className="w-5 h-5 text-green-400" />;
      case 'word':
        return <FileText className="w-5 h-5 text-blue-400" />;
      case 'powerpoint':
        return <FileText className="w-5 h-5 text-orange-400" />;
      default:
        return <File className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1b2e] text-white p-6">
      <div className="max-w-[1920px] mx-auto space-y-6">
        {/* Header with Repository Selector */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Project Dashboard</h1>
          <select 
            value={selectedRepo}
            onChange={(e) => setSelectedRepo(e.target.value)}
            className="bg-[#2d1b4e] border border-[#4c3b6e] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>All Projects</option>
            <option>Project A</option>
            <option>Project B</option>
          </select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#2d1b4e] p-6 rounded-xl"
          >
            <div className="flex items-center gap-4">
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <Activity className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Active Projects</p>
                <p className="text-2xl font-bold">35</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#2d1b4e] p-6 rounded-xl"
          >
            <div className="flex items-center gap-4">
              <div className="bg-green-500/20 p-3 rounded-lg">
                <GitMerge className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Completed Projects</p>
                <p className="text-2xl font-bold">9</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#2d1b4e] p-6 rounded-xl"
          >
            <div className="flex items-center gap-4">
              <div className="bg-red-500/20 p-3 rounded-lg">
                <GitPullRequest className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Active Issues</p>
                <p className="text-2xl font-bold">20</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#2d1b4e] p-6 rounded-xl"
          >
            <div className="flex items-center gap-4">
              <div className="bg-purple-500/20 p-3 rounded-lg">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Team Members</p>
                <p className="text-2xl font-bold">9</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Documents and Upcoming Events */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Documents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#2d1b4e] p-6 rounded-xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Recent Documents</h3>
              <button className="text-blue-400 hover:text-blue-300 text-sm">View All</button>
            </div>
            <div className="space-y-4">
              {recentDocuments.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-[#1a1b2e] rounded-lg">
                  <div className="flex items-center gap-3">
                    {getFileIcon(doc.type)}
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-sm text-gray-400">Modified {doc.modified}</p>
                    </div>
                  </div>
                  <button className="text-blue-400 hover:text-blue-300">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#2d1b4e] p-6 rounded-xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Upcoming Events</h3>
              <button className="text-blue-400 hover:text-blue-300 text-sm">Show all</button>
            </div>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="p-4 bg-[#1a1b2e] rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{event.title}</h4>
                      <p className="text-sm text-gray-400 mt-1">{event.time}</p>
                    </div>
                    <div className="flex -space-x-2">
                      {event.attendees.map((attendee, i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-medium border-2 border-[#2d1b4e]"
                        >
                          {attendee.split(' ')[0][0]}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Project Overview with Calendar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {/* Charts Section */}
            <div className="relative">
              <button
                onClick={() => scrollCharts('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#2d1b4e] p-2 rounded-full"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              
              <div 
                ref={chartsScrollRef}
                className="overflow-x-auto flex gap-6 pb-4 scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {/* Weekly Activity Chart */}
                <div className="min-w-[400px] bg-[#2d1b4e] p-6 rounded-xl">
                  <h3 className="text-lg font-semibold mb-4">Weekly Activity</h3>
                  <div className="h-64">
                    <Line
                      data={{
                        labels: ['Feb 10', 'Feb 11', 'Feb 12', 'Feb 13', 'Feb 14', 'Feb 15'],
                        datasets: [
                          {
                            label: 'Issues',
                            data: [4, 6, 3, 5, 2, 7],
                            borderColor: '#3b82f6',
                            tension: 0.4
                          },
                          {
                            label: 'Pull Requests',
                            data: [2, 4, 1, 3, 5, 4],
                            borderColor: '#8b5cf6',
                            tension: 0.4
                          }
                        ]
                      }}
                      options={chartOptions}
                    />
                  </div>
                </div>

                {/* Team Issue Distribution */}
                <div className="min-w-[400px] bg-[#2d1b4e] p-6 rounded-xl">
                  <h3 className="text-lg font-semibold mb-4">Team Issue Distribution</h3>
                  <div className="h-64">
                    <Bar
                      data={{
                        labels: ['Team A', 'Team B', 'Team C', 'Team D'],
                        datasets: [
                          {
                            label: 'Bugs',
                            data: [12, 8, 15, 5],
                            backgroundColor: '#ef4444'
                          },
                          {
                            label: 'Features',
                            data: [8, 5, 10, 7],
                            backgroundColor: '#3b82f6'
                          },
                          {
                            label: 'Enhancements',
                            data: [5, 3, 7, 4],
                            backgroundColor: '#10b981'
                          }
                        ]
                      }}
                      options={chartOptions}
                    />
                  </div>
                </div>

                {/* Priority Distribution */}
                <div className="min-w-[400px] bg-[#2d1b4e] p-6 rounded-xl">
                  <h3 className="text-lg font-semibold mb-4">Priority Distribution</h3>
                  <div className="h-64">
                    <Pie
                      data={{
                        labels: ['High', 'Medium', 'Low'],
                        datasets: [{
                          data: [7, 2, 1],
                          backgroundColor: ['#ef4444', '#f59e0b', '#10b981']
                        }]
                      }}
                      options={chartOptions}
                    />
                  </div>
                </div>

                {/* Team Performance */}
                <div className="min-w-[400px] bg-[#2d1b4e] p-6 rounded-xl">
                  <h3 className="text-lg font-semibold mb-4">Team Performance</h3>
                  <div className="h-64">
                    <Bar
                      data={{
                        labels: ['Team A', 'Team B', 'Team C', 'Team D'],
                        datasets: [
                          {
                            label: 'Open Issues',
                            data: [5, 3, 8, 4],
                            backgroundColor: '#ef4444'
                          },
                          {
                            label: 'Closed Issues',
                            data: [7, 4, 6, 5],
                            backgroundColor: '#10b981'
                          }
                        ]
                      }}
                      options={chartOptions}
                    />
                  </div>
                </div>

                {/* Completion Rate */}
                <div className="min-w-[400px] bg-[#2d1b4e] p-6 rounded-xl">
                  <h3 className="text-lg font-semibold mb-4">Completion Rate</h3>
                  <div className="h-64">
                    <Line
                      data={{
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                        datasets: [{
                          label: 'Completion Rate',
                          data: [75, 82, 90, 85, 88, 95],
                          borderColor: '#8b5cf6',
                          fill: true,
                          backgroundColor: 'rgba(139, 92, 246, 0.1)'
                        }]
                      }}
                      options={chartOptions}
                    />
                  </div>
                </div>

                {/* Issue Resolution Time */}
                <div className="min-w-[400px] bg-[#2d1b4e] p-6 rounded-xl">
                  <h3 className="text-lg font-semibold mb-4">Issue Resolution Time</h3>
                  <div className="h-64">
                    <Bar
                      data={{
                        labels: ['Critical', 'High', 'Medium', 'Low'],
                        datasets: [{
                          label: 'Average Days',
                          data: [1.5, 3, 5, 7],
                          backgroundColor: '#8b5cf6'
                        }]
                      }}
                      options={chartOptions}
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => scrollCharts('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#2d1b4e] p-2 rounded-full"
              >
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Calendar Section */}
          <div className="bg-[#2d1b4e] p-6 rounded-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Project Overview</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedMonth(subDays(selectedMonth, 30))}
                  className="p-2 hover:bg-[#1a1b2e] rounded-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span>{format(selectedMonth, 'MMMM yyyy')}</span>
                <button
                  onClick={() => setSelectedMonth(addDays(selectedMonth, 30))}
                  className="p-2 hover:bg-[#1a1b2e] rounded-lg"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-sm text-gray-400">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {getDaysInMonth().map((date, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedDate(date)}
                  className={`
                    p-2 rounded-lg text-center
                    ${isSameDay(date, selectedDate) ? 'bg-blue-600' : 'hover:bg-[#1a1b2e]'}
                    ${isSameDay(date, new Date()) ? 'border border-blue-400' : ''}
                  `}
                >
                  {format(date, 'd')}
                </button>
              ))}
            </div>

            <div className="mt-6">
              <h4 className="font-medium mb-4">Events for {format(selectedDate, 'MMMM d, yyyy')}</h4>
              <div className="space-y-3">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="p-3 bg-[#1a1b2e] rounded-lg">
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-gray-400">{event.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Activity Log */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#2d1b4e] p-6 rounded-xl"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Activity Log</h2>
            <button
              onClick={() => generateActivityLogPDF(stats?.activityLogs || [])}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {stats?.activityLogs?.map((log: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-[#1a1b2e] p-4 rounded-lg border border-[#2d1b4e]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      log.type === 'pull' ? 'bg-purple-500/20' : 'bg-blue-500/20'
                    }`}>
                      {log.type === 'pull' ? 
                        <GitPullRequest className="w-4 h-4 text-purple-400" /> : 
                        <Activity className="w-4 h-4 text-blue-400" />
                      }
                    </div>
                    <div>
                      <p className="font-medium">{log.title}</p>
                      <p className="text-sm text-gray-400">
                        {log.user} • {format(new Date(log.date), 'MMM d, yyyy HH:mm')}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm px-3 py-1 rounded-full bg-[#2d1b4e] text-gray-300">
                    {log.action}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};