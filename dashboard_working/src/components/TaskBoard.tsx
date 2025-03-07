import React from 'react';
import { MoreHorizontal } from 'lucide-react';

export const TaskBoard = () => {
  const columns = [
    { id: 'todo', title: 'To Do', count: 0 },
    { id: 'inProgress', title: 'In Progress', count: 0 },
    { id: 'done', title: 'Done', count: 0 },
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Tasks</h2>
      <div className="grid grid-cols-3 gap-6">
        {columns.map((column) => (
          <div key={column.id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="font-medium">{column.title}</span>
                <span className="text-sm text-gray-500">{column.count}</span>
              </div>
              <button className="text-gray-600 hover:bg-gray-200 rounded-lg p-1">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
            
            <button className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600">
              + Create
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};