import React from 'react';
import Card from '../common/Card';
import Stat from '../common/Stat';

export const ImpactStats = ({ stats = {} }) => {
  return (
    <Card 
      variant="gradient"
      className="bg-gradient-to-br from-blue-600 to-blue-800 text-white"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-2xl font-bold">{stats.planName || 'Unlimited Plan'}</div>
          <div className="text-blue-100">{stats.daysLeft || 87} days remaining</div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>This week</span>
          <span>{stats.thisWeekUsed || 10}/{stats.thisWeekTotal || 14} used</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-3">
          <div 
            className="bg-white rounded-full h-3 transition-all" 
            style={{ width: `${stats.weekProgress || 71}%` }}
          ></div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Stat 
          label="Swipes Shared" 
          value={stats.swipesShared || 12}
          color="bg-white/20"
        />
        <Stat 
          label="Meals Given" 
          value={stats.mealsGiven || 12}
          color="bg-white/20"
        />
      </div>
    </Card>
  );
};

export default ImpactStats;
