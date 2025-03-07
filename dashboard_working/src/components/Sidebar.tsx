import React from 'react';
import { LayoutDashboard, Users, FileText, Clock, Home } from 'lucide-react';

export const Sidebar = () => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-semibold">Dashboard</span>
          <button className="ml-auto">
            <span className="text-xl">+</span>
          </button>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          <a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white">
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </a>
          <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
            <Home className="w-5 h-5 mr-3" />
            Project
          </a>
          <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
            <Users className="w-5 h-5 mr-3" />
            Teams
          </a>
          <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
            <FileText className="w-5 h-5 mr-3" />
            Reports
          </a>
        </div>
        
        <div className="mt-8">
          <h3 className="px-3 text-sm font-medium text-gray-500">Recent Projects</h3>
          <div className="mt-2 space-y-1">
            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
              <Clock className="w-5 h-5 mr-3" />
              Overview
            </a>
          </div>
        </div>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt="Profile"
            className="w-8 h-8 rounded-full"
          />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">Shreya</p>
            <p className="text-xs text-gray-500">project manager</p>
          </div>
          <button className="ml-auto px-3 py-1 text-sm text-white bg-red-500 rounded-md">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};