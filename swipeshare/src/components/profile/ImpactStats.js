import React from 'react';
import Card from '../common/Card';
import Stat from '../common/Stat';
import './ImpactStats.css';

export const ImpactStats = ({ stats = {} }) => {
  return (
    <Card variant="gradient">
      <div className="impact-stats-header">
        <div>
          <div className="impact-stats-plan">{stats.planName || 'Unlimited Plan'}</div>
          <div className="impact-stats-days">{stats.daysLeft || 87} days remaining</div>
        </div>
      </div>
      
      <div className="impact-stats-progress">
        <div className="impact-stats-progress-text">
          <span>This week</span>
          <span>{stats.thisWeekUsed || 10}/{stats.thisWeekTotal || 14} used</span>
        </div>
        <div className="impact-stats-progress-bar">
          <div 
            className="impact-stats-progress-fill" 
            style={{ width: `${stats.weekProgress || 71}%` }}
          ></div>
        </div>
      </div>

      <div className="impact-stats-grid">
        <Stat 
          label="Swipes Shared" 
          value={stats.swipesShared || 12}
          color="rgba(255, 255, 255, 0.2)"
          textColor="white"
        />
        <Stat 
          label="Meals Given" 
          value={stats.mealsGiven || 12}
          color="rgba(255, 255, 255, 0.2)"
          textColor="white"
        />
      </div>
    </Card>
  );
};

export default ImpactStats;
