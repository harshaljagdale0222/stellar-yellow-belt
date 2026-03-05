// import { useState, useEffect } from 'react';
// import { Toaster } from 'sonner';
// import Navbar from './components/Navbar';
// import WalletConnect from './components/WalletConnect';
// import CreatePoll from './components/CreatePoll';
// import PollCard from './components/PollCard';
// import TransactionStatus from './components/TransactionStatus';
// import { useWalletStore } from './store/walletStore';
// import './index.css';

// function App() {
//   const { wallet } = useWalletStore();
//   const [polls, setPolls] = useState([]);
//   const [showCreatePoll, setShowCreatePoll] = useState(false);

//   useEffect(() => {
//     const savedPolls = localStorage.getItem('polls');
//     if (savedPolls) {
//       setPolls(JSON.parse(savedPolls));
//     }
//   }, []);

//   const handleAddPoll = (poll) => {
//     const updatedPolls = [poll, ...polls];
//     setPolls(updatedPolls);
//     localStorage.setItem('polls', JSON.stringify(updatedPolls));
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
//       <Navbar />
//       <Toaster position="top-right" />

//       <main className="max-w-7xl mx-auto px-4 py-8">
//         {!wallet ? (
//           <div className="flex items-center justify-center min-h-[60vh]">
//             <WalletConnect />
//           </div>
//         ) : (
//           <div className="space-y-8">
//             <div className="text-center">
//               <h1 className="text-5xl font-black text-cyan-400 mb-4">
//                 🗳️ Stellar Live Polls
//               </h1>
//               <p className="text-gray-300 text-lg">
//                 Real-time voting on Stellar blockchain
//               </p>
//             </div>

//             <div className="flex justify-center">
//               <button
//                 onClick={() => setShowCreatePoll(!showCreatePoll)}
//                 className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg hover:shadow-xl transition-all duration-300"
//               >
//                 {showCreatePoll ? '✕ Cancel' : '+ Create New Poll'}
//               </button>
//             </div>

//             {showCreatePoll && (
//               <div className="max-w-2xl mx-auto">
//                 <CreatePoll 
//                   onSuccess={() => setShowCreatePoll(false)}
//                   onAddPoll={handleAddPoll}
//                 />
//               </div>
//             )}

//             <TransactionStatus />

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {polls.length === 0 ? (
//                 <div className="col-span-full text-center py-16">
//                   <p className="text-gray-400 text-xl">No polls yet. Create one!</p>
//                 </div>
//               ) : (
//                 polls.map((poll) => (
//                   <PollCard key={poll.id} poll={poll} />
//                 ))
//               )}
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

// export default App;

import React, { useState } from 'react';
import { Wallet, Gift, LogOut, Zap } from 'lucide-react';
import RewardsDisplay from './components/RewardsDisplay';

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [userRewards, setUserRewards] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [interContractLog, setInterContractLog] = useState([]);
  const [lastTransaction, setLastTransaction] = useState(null);

  const handleConnect = () => {
    setIsConnected(true);
    addLog('✅ Wallet Connected');
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setUserRewards(0);
    setInterContractLog([]);
    addLog('❌ Wallet Disconnected');
  };

  const addLog = (message) => {
    setInterContractLog(prev => [...prev, {
      message,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const handleVote = (option) => {
    // STEP 1: Voting Contract - submit vote
    addLog(`🗳️ Voting on: "${option}"`);
    
    // STEP 2: Inter-Contract Call - Voting → Rewards
    setTimeout(() => {
      addLog('🔗 Inter-Contract Call Initiated');
      addLog('📡 Voting Contract → Rewards Contract');
      
      // STEP 3: Rewards Contract - award points
      setTimeout(() => {
        const newRewards = userRewards + 10;
        setUserRewards(newRewards);
        setShowReward(true);
        
        addLog('✨ Rewards Contract: +10 Points Awarded');
        addLog(`💰 Total Rewards: ${newRewards} Points`);
        
        setLastTransaction({
          type: 'inter-contract-call',
          votedFor: option,
          pointsEarned: 10,
          totalPoints: newRewards,
          contractChain: 'VotingContract → RewardsContract'
        });
        
        setTimeout(() => setShowReward(false), 5000);
      }, 800);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-cyan-400">🗳️ Stellar Live Polls - Level 4</h1>
          
          <div className="flex items-center gap-4">
            {isConnected && (
              <div className="bg-yellow-500/20 border border-yellow-500/50 px-4 py-2 rounded-lg flex items-center gap-2">
                <Gift className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-300 font-bold">{userRewards}</span>
                <span className="text-yellow-300 text-sm">Points</span>
              </div>
            )}

            {!isConnected ? (
              <button
                onClick={handleConnect}
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg font-semibold transition"
              >
                <Wallet className="inline w-4 h-4 mr-2" />
                Connect Wallet
              </button>
            ) : (
              <button
                onClick={handleDisconnect}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {!isConnected ? (
          <div className="text-center py-20">
            <h2 className="text-4xl font-bold text-white mb-4">🔐 Connect Your Wallet</h2>
            <p className="text-slate-400 mb-8 text-lg">Vote on polls and earn rewards via inter-contract calls!</p>
            <button
              onClick={handleConnect}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-lg font-bold text-lg transition"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {/* Polls Section - 2/3 width */}
            <div className="col-span-2">
              <h2 className="text-2xl font-bold text-white mb-6">Active Polls</h2>
              
              <div className="grid gap-6">
                {/* Poll 1 */}
                <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-cyan-500 transition">
                  <h3 className="text-xl font-bold text-white mb-4">Best Programming Language?</h3>
                  
                  <div className="space-y-3 mb-6">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-300 font-semibold">JavaScript</span>
                        <span className="text-cyan-400">6 (66%)</span>
                      </div>
                      <div className="bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div className="bg-cyan-500 h-full w-2/3"></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-300 font-semibold">Python</span>
                        <span className="text-cyan-400">3 (33%)</span>
                      </div>
                      <div className="bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div className="bg-cyan-500 h-full w-1/3"></div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleVote('JavaScript')}
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded transition flex items-center justify-center gap-2"
                    >
                      <Zap className="w-4 h-4" />
                      Vote JS
                    </button>
                    <button
                      onClick={() => handleVote('Python')}
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded transition flex items-center justify-center gap-2"
                    >
                      <Zap className="w-4 h-4" />
                      Vote Python
                    </button>
                  </div>
                </div>

                {/* Poll 2 */}
                <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-cyan-500 transition">
                  <h3 className="text-xl font-bold text-white mb-4">Blockchain Future?</h3>
                  
                  <div className="space-y-3 mb-6">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-300 font-semibold">Bright</span>
                        <span className="text-cyan-400">8 (66%)</span>
                      </div>
                      <div className="bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div className="bg-cyan-500 h-full w-2/3"></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-300 font-semibold">Uncertain</span>
                        <span className="text-cyan-400">4 (33%)</span>
                      </div>
                      <div className="bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div className="bg-cyan-500 h-full w-1/3"></div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleVote('Bright')}
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded transition flex items-center justify-center gap-2"
                    >
                      <Zap className="w-4 h-4" />
                      Bright
                    </button>
                    <button
                      onClick={() => handleVote('Uncertain')}
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded transition flex items-center justify-center gap-2"
                    >
                      <Zap className="w-4 h-4" />
                      Uncertain
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Inter-Contract Call Log - 1/3 width */}
            <div className="col-span-1">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 sticky top-24">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  Contract Flow
                </h3>

                {/* Contract Chain Diagram */}
                <div className="mb-6 p-4 bg-slate-700/50 rounded border border-cyan-500/30">
                  <div className="text-center">
                    <div className="bg-cyan-500/20 border border-cyan-500 rounded p-2 mb-2 text-xs font-bold text-cyan-400">
                      Voting Contract
                    </div>
                    <div className="text-cyan-400 text-lg mb-2">↓</div>
                    <div className="text-cyan-400 text-xs mb-2 font-bold">Inter-Contract Call</div>
                    <div className="text-cyan-400 text-lg mb-2">↓</div>
                    <div className="bg-yellow-500/20 border border-yellow-500 rounded p-2 text-xs font-bold text-yellow-400">
                      Rewards Contract
                    </div>
                  </div>
                </div>

                {/* Transaction Log */}
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {interContractLog.length === 0 ? (
                    <p className="text-slate-400 text-sm">Cast a vote to see contract flow...</p>
                  ) : (
                    interContractLog.map((log, idx) => (
                      <div key={idx} className="bg-slate-700/50 p-2 rounded text-xs text-slate-300 border-l-2 border-cyan-500">
                        <div className="text-cyan-400 font-mono">{log.timestamp}</div>
                        <div className="mt-1">{log.message}</div>
                      </div>
                    ))
                  )}
                </div>

                {/* Last Transaction */}
                {lastTransaction && (
                  <div className="mt-6 p-4 bg-green-500/10 border border-green-500 rounded">
                    <h4 className="text-green-400 font-bold mb-2">✅ Last Transaction</h4>
                    <div className="text-xs text-slate-300 space-y-1">
                      <div>Vote: <span className="text-green-400 font-mono">{lastTransaction.votedFor}</span></div>
                      <div>Earned: <span className="text-yellow-400 font-bold">+{lastTransaction.pointsEarned} Points</span></div>
                      <div>Total: <span className="text-cyan-400 font-bold">{lastTransaction.totalPoints} Points</span></div>
                      <div className="mt-2 pt-2 border-t border-green-500/30 text-green-400 text-xs">
                        Chain: {lastTransaction.contractChain}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Reward Notification */}
      <RewardsDisplay showReward={showReward} userRewards={userRewards} />
    </div>
  );
}