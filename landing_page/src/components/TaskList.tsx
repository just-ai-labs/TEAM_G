import React from 'react';
import { motion } from 'framer-motion';
import { Task } from '../types';
import { format } from 'date-fns';
import { AlertCircle, FileText, MessageSquare } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const getTaskIcon = (type: Task['type']) => {
  switch (type) {
    case 'slack':
      return <MessageSquare className="w-5 h-5" />;
    case 'docs':
      return <FileText className="w-5 h-5" />;
    case 'notes':
      return <AlertCircle className="w-5 h-5" />;
  }
};

const getTaskColor = (type: Task['type']) => {
  switch (type) {
    case 'slack':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
    case 'docs':
      return 'bg-green-500/20 text-green-400 border-green-500/50';
    case 'notes':
      return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
  }
};

export const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskClick }) => {
  return (
    <div className="space-y-4">
      {tasks.map((task, index) => (
        <motion.div
          key={task.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onTaskClick(task)}
          className={`p-4 rounded-lg border cursor-pointer hover:scale-[1.02] transition-transform ${getTaskColor(
            task.type
          )}`}
        >
          <div className="flex items-center gap-3">
            {getTaskIcon(task.type)}
            <div className="flex-1">
              <h3 className="font-semibold mb-1">{task.title}</h3>
              <p className="text-sm opacity-80 line-clamp-2">{task.description}</p>
            </div>
            <div className="text-xs opacity-60">
              {format(new Date(task.created_at), 'MMM d, yyyy')}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};