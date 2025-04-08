
import React from 'react';
import { useAuth } from '@/hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="bg-card p-4 rounded-lg shadow">
        <p className="text-lg">Welcome{user?.name ? `, ${user.name}` : ''}!</p>
        <p className="text-muted-foreground mt-2">
          This is your personal dashboard. Here you'll see your progress and recommended activities.
        </p>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-secondary/30 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Meditation Minutes</h3>
          <p className="text-2xl font-bold">45</p>
          <p className="text-xs text-muted-foreground">This week</p>
        </div>
        
        <div className="bg-secondary/30 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Focus Score</h3>
          <p className="text-2xl font-bold">82%</p>
          <p className="text-xs text-muted-foreground">Last session</p>
        </div>
        
        <div className="bg-secondary/30 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Streak</h3>
          <p className="text-2xl font-bold">3 Days</p>
          <p className="text-xs text-muted-foreground">Keep it going!</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
