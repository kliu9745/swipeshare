import React from 'react';
import Card from '../common/Card';

export const MatchResult = ({ matches, onSelectMatch, isLoading = false }) => {
  if (isLoading) {
    return (
      <Card className="text-center py-8">
        <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Finding the best match...</p>
      </Card>
    );
  }

  if (!matches || matches.length === 0) {
    return (
      <Card className="text-center py-8">
        <p className="text-gray-600">No matches found at this time.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-900">AI Recommended Matches</h3>
      {matches.map((match, index) => (
        <Card 
          key={index}
          variant="bordered"
          onClick={() => onSelectMatch(match)}
          className="cursor-pointer hover:border-blue-400"
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="font-semibold text-gray-900">{match.name}</div>
              <div className="text-sm text-gray-500">Match Score: {(match.score * 100).toFixed(0)}%</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{(match.score * 100).toFixed(0)}%</div>
            </div>
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <p>📍 {match.location}</p>
            <p>🎯 Need Level: {match.needScore}/10</p>
            <p>✓ Reliability: {match.completionRate}%</p>
          </div>
          <button className="text-blue-600 text-sm font-semibold mt-3 hover:text-blue-700">
            Transfer to {match.name} →
          </button>
        </Card>
      ))}
    </div>
  );
};

export default MatchResult;
