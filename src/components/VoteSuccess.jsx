import { CheckCircle } from 'lucide-react';

export default function VoteSuccess({ option, pollQuestion }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-gradient-to-br from-green-900 to-green-800 border-2 border-green-400 rounded-xl p-8 max-w-md text-center shadow-2xl animate-fadeIn">
        
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-green-300 animate-bounce" />
        </div>

        <h2 className="text-3xl font-black text-green-100 mb-2">
          🎉 Congratulations!
        </h2>

        <p className="text-green-200 text-lg mb-4">
          Your vote has been successfully recorded!
        </p>

        <div className="bg-green-900/50 border border-green-400/30 rounded-lg p-4 mb-6">
          <p className="text-sm text-green-300 mb-2">You voted:</p>
          <p className="text-2xl font-bold text-green-100">
            {option === 'yes' ? '👍 YES' : '👎 NO'}
          </p>
          <p className="text-xs text-green-300 mt-3 line-clamp-2">
            "{pollQuestion}"
          </p>
        </div>

        <div className="space-y-2 mb-6">
          <div className="flex items-center justify-center gap-2 text-green-200">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm">Transaction submitted to blockchain</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-green-300">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-semibold">Vote confirmed on Stellar</span>
          </div>
        </div>

        <p className="text-green-300 text-sm">
          Thank you for participating! 🗳️
        </p>
      </div>
    </div>
  );
}

