import React from 'react';
import { motion } from 'framer-motion';
import { Task } from '../types';
import { X } from 'lucide-react';
import { format } from 'date-fns';

interface TaskModalProps {
  task: Task;
  onClose: () => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({ task, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">{task.title}</h2>
            <p className="text-sm text-gray-400">
              Created on {format(new Date(task.created_at), 'MMMM d, yyyy')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-1">
              Description
            </h3>
            <p className="text-white">{task.description}</p>
          </div>

          <div className="flex gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 mb-1">Type</h3>
              <span className="text-white capitalize">{task.type}</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 mb-1">
                Priority
              </h3>
              <span className="text-white capitalize">{task.priority}</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 mb-1">Status</h3>
              <span className="text-white capitalize">{task.status}</span>
            </div>
          </div>

          {task.assignee && (
            <div>
              <h3 className="text-sm font-semibold text-gray-400 mb-1">
                Assignee
              </h3>
              <span className="text-white">{task.assignee}</span>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};