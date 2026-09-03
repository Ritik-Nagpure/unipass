import React from 'react';

const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <h3 className="font-semibold">Total Users</h3>
          <p className="text-2xl font-bold">1,234</p>
        </div>
        <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-lg">
          <h3 className="font-semibold">Revenue</h3>
          <p className="text-2xl font-bold">$12,345</p>
        </div>
        <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
          <h3 className="font-semibold">Active</h3>
          <p className="text-2xl font-bold">89%</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;