'use client'

import React, { useEffect, useState } from 'react';

const LitterStats: React.FC = () => {
  const [litterCount, setLitterCount] = useState<number>(0);

  useEffect(() => {
    const fetchLitterCount = async () => {
      try {
        const response = await fetch('http://<your-server-ip>:5000/litter_count');
        const data = await response.json();
        setLitterCount(data.litter_count);
      } catch (error) {
        console.error('Error fetching litter count:', error);
      }
    };

    const intervalId = setInterval(fetchLitterCount, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">Total Incidents</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{litterCount}</p>
        </div>
        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
          {/* Your AlertTriangle icon here */}
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <span className="text-sm text-green-600 font-medium">+12% </span>
        <span className="text-sm text-gray-500 ml-1">from last month</span>
      </div>
    </div>
  );
};

export default LitterStats;
