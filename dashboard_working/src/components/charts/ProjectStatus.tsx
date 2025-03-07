import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';
import type { ProjectStatus as ProjectStatusType } from '../../types/github';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ProjectStatusProps {
  data: ProjectStatusType;
}

export const ProjectStatus = ({ data }: ProjectStatusProps) => {
  const chartData: ChartData<'pie'> = {
    labels: ['In Progress', 'Completed', 'On Hold', 'Delayed'],
    datasets: [
      {
        data: [
          data.inProgress,
          data.completed,
          data.onHold,
          data.delayed
        ],
        backgroundColor: [
          '#2563EB', // blue
          '#22C55E', // green
          '#F59E0B', // yellow
          '#EF4444', // red
        ],
        borderWidth: 0,
      },
    ],
  };

  const options: ChartOptions<'pie'> = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="bg-white p-6 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Project Status</h2>
      </div>
      <div className="h-64">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
};