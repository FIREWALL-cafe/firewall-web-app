import React from 'react';
import Spinner from '../assets/spinner.svg';

/**
 * SearchProgressIndicator - Shows the current stage of the search process
 * Provides visual feedback for multi-step search operations
 */
function SearchProgressIndicator({ stage, estimatedTimeRemaining = null }) {
  const stages = [
    { id: 'translating', label: 'Translating query', icon: '🌐', duration: 1 },
    { id: 'searching-google', label: 'Searching Google', icon: '🔍', duration: 2 },
    { id: 'searching-baidu', label: 'Searching Baidu', icon: '🔍', duration: 3 },
    { id: 'saving', label: 'Processing results', icon: '💾', duration: 2 },
    { id: 'complete', label: 'Complete', icon: '✓', duration: 0 },
  ];

  const currentStageIndex = stages.findIndex(s => s.id === stage);
  const currentStage = stages[currentStageIndex];

  if (!currentStage || stage === 'complete') {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-4 mb-6">
      {/* Progress bar */}
      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
        <div
          className="absolute top-0 left-0 h-full bg-blue-600 transition-all duration-500 ease-out"
          style={{
            width: `${((currentStageIndex + 1) / stages.length) * 100}%`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer" />
        </div>
      </div>

      {/* Current stage info */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <img src={Spinner} alt="Loading" className="w-4 h-4 animate-spin" />
          <span className="font-medium text-gray-700">{currentStage.label}</span>
        </div>
        {estimatedTimeRemaining !== null && estimatedTimeRemaining > 0 && (
          <span className="text-gray-500 text-xs">
            ~{estimatedTimeRemaining}s remaining
          </span>
        )}
      </div>

      {/* Stage indicators */}
      <div className="flex justify-between mt-3">
        {stages.slice(0, -1).map((s, index) => (
          <div
            key={s.id}
            className={`flex flex-col items-center gap-1 ${
              index <= currentStageIndex ? 'opacity-100' : 'opacity-40'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors duration-300 ${
                index < currentStageIndex
                  ? 'bg-green-500 text-white'
                  : index === currentStageIndex
                  ? 'bg-blue-600 text-white animate-pulse'
                  : 'bg-gray-300 text-gray-600'
              }`}
            >
              {index < currentStageIndex ? '✓' : s.icon}
            </div>
            <span className="text-xs text-gray-600 hidden md:block max-w-[80px] text-center">
              {s.label.split(' ')[0]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchProgressIndicator;
