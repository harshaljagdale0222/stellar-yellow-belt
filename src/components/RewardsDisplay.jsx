import React, { useState, useEffect } from 'react';
import { Gift, CheckCircle } from 'lucide-react';

export default function RewardsDisplay({ showReward, userRewards }) {
  const [display, setDisplay] = useState(false);

  useEffect(() => {
    if (showReward) {
      setDisplay(true);
      setTimeout(() => setDisplay(false), 5000);
    }
  }, [showReward]);

  if (!display) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 p-6 rounded-lg shadow-2xl text-white animate-bounce z-40">
      <div className="flex items-center gap-3">
        <Gift className="w-6 h-6" />
        <div>
          <h3 className="font-bold text-lg">🎉 Reward Earned!</h3>
          <p className="text-sm">+10 points for voting!</p>
          <p className="text-xs mt-1">Total: {userRewards} points</p>
        </div>
        <CheckCircle className="w-5 h-5 ml-2" />
      </div>
    </div>
  );
}