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
import { Wallet, Gift, LogOut, Zap, CheckCircle } from 'lucide-react';
import RewardsDisplay from './components/RewardsDisplay';

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [userRewards, setUserRewards] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [voteSuccess, setVoteSuccess] = useState(null);
  const [interContractLogs, setInterContractLogs] = useState([]);

  const handleConnect = () => {
    setIsConnected(true);
    addLog('✅ Wallet Connected Successfully');
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setUserRewards(0);
    setInterContractLogs([]);
  };

  const addLog = (message) => {
    setInterContractLogs(prev => [...prev, {
      message,
      time: new Date().toLocaleTimeString()
    }]);
  };

  const handleVote = (option) => {
    // Step 1: Submit Vote
    addLog(`🗳️ User voted for: "${option}"`);
    
    // Step 2: Voting Contract receives vote
    setTimeout(() => {
      addLog('📝 Voting Contract: Vote recorded');
      
      // Step 3: Inter-Contract Call initiated
      setTimeout(() => {
        addLog('🔗 INTER-CONTRACT CALL INITIATED');
        addLog('📤 Voting Contract → Rewards Contract');
        
        // Step 4: Rewards Contract awards points
        setTimeout(() => {
          const newRewards = userRewards + 10;
          setUserRewards(newRewards);
          setShowReward(true);
          
          addLog('💰 Rewards Contract: +10 Points Awarded');
          addLog(`✨ Total Rewards Updated: ${newRewards} pts`);
          
          setVoteSuccess({
            option: option,
            points: 10,
            total: newRewards
          });
          
          setTimeout(() => setVoteSuccess(null), 5000);
        }, 600);
      }, 600);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-cyan-400">🗳️ Stellar Live Polls</h1>
            <p className="text-xs text-slate-400">Level 4 - Inter-Contract Calls</p>
          </div>
          
          <div className="flex items-center gap-4">
            {isConnected && (
              <div className="bg-yellow-500/20 border border-yellow-500/50 px-4 py-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-yellow-400" />
                  <span className="text-yellow-300 font-bold">{userRewards}</span>
                  <span className="text-yellow-300 text-sm">Points</span>
                </div>
              </div>
            )}

            {!isConnected ? (
              <button
                onClick={handleConnect}
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg font-semibold transition"
              >
                <Wallet className="inline w-4 h-4 mr-2" />
                Connect
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
          <div className="text-center py-32">
            <h2 className="text-4xl font-bold text-white mb-4">🔐 Connect Wallet</h2>
            <p className="text-slate-400 mb-8 text-lg">Vote and earn rewards through inter-contract calls!</p>
            <button
              onClick={handleConnect}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-lg font-bold text-lg transition"
            >
              Connect Wallet Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {/* Polls - 2/3 */}
            <div className="col-span-2">
              <h2 className="text-2xl font-bold text-white mb-6">🗳️ Active Polls</h2>
              
              <div className="grid gap-6">
                {/* Poll 1 */}
                <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                  <h3 className="text-xl font-bold text-white mb-4">Best Programming Language?</h3>
                  
                  <div className="space-y-3 mb-6">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-300">JavaScript</span>
                        <span className="text-cyan-400 font-bold">6 (66%)</span>
                      </div>
                      <div className="bg-slate-700 h-3 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full w-2/3"></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-300">Python</span>
                        <span className="text-cyan-400 font-bold">3 (33%)</span>
                      </div>
                      <div className="bg-slate-700 h-3 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full w-1/3"></div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleVote('JavaScript')}
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded transition flex items-center justify-center gap-2"
                    >
                      <Zap className="w-4 h-4" />
                      Vote JavaScript
                    </button>
                    <button
                      onClick={() => handleVote('Python')}
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded transition flex items-center justify-center gap-2"
                    >
                      <Zap className="w-4 h-4" />
                      Vote Python
                    </button>
                  </div>
                </div>

                {/* Poll 2 */}
                <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                  <h3 className="text-xl font-bold text-white mb-4">Blockchain Future?</h3>
                  
                  <div className="space-y-3 mb-6">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-300">Bright 🚀</span>
                        <span className="text-cyan-400 font-bold">8 (66%)</span>
                      </div>
                      <div className="bg-slate-700 h-3 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full w-2/3"></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-300">Uncertain ❓</span>
                        <span className="text-cyan-400 font-bold">4 (33%)</span>
                      </div>
                      <div className="bg-slate-700 h-3 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full w-1/3"></div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleVote('Bright')}
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded transition flex items-center justify-center gap-2"
                    >
                      <Zap className="w-4 h-4" />
                      Bright Future
                    </button>
                    <button
                      onClick={() => handleVote('Uncertain')}
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded transition flex items-center justify-center gap-2"
                    >
                      <Zap className="w-4 h-4" />
                      Uncertain
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Inter-Contract Call Display - 1/3 */}
            <div className="col-span-1">
              {/* Contract Flow Diagram */}
              <div className="bg-slate-800 border-2 border-cyan-500 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Contract Flow
                </h3>
                
                <div className="space-y-3 text-center">
                  <div className="bg-cyan-500/20 border border-cyan-500 rounded p-3">
                    <div className="text-cyan-400 font-bold text-sm">🗳️ Voting Contract</div>
                    <div className="text-xs text-cyan-300 mt-1">Accepts votes</div>
                  </div>
                  
                  <div className="text-cyan-400 font-bold">⬇️</div>
                  
                  <div className="bg-yellow-500/20 border border-yellow-500 rounded p-3">
                    <div className="text-yellow-400 font-bold text-sm">🔗 Inter-Contract Call</div>
                    <div className="text-xs text-yellow-300 mt-1">Voting → Rewards</div>
                  </div>
                  
                  <div className="text-yellow-400 font-bold">⬇️</div>
                  
                  <div className="bg-green-500/20 border border-green-500 rounded p-3">
                    <div className="text-green-400 font-bold text-sm">💰 Rewards Contract</div>
                    <div className="text-xs text-green-300 mt-1">Awards +10 points</div>
                  </div>
                </div>
              </div>

              {/* Transaction Log */}
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-4">📊 Contract Log</h3>
                
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {interContractLogs.length === 0 ? (
                    <p className="text-slate-400 text-sm text-center py-4">Cast a vote to see flow...</p>
                  ) : (
                    interContractLogs.map((log, idx) => (
                      <div key={idx} className="bg-slate-700/50 p-2 rounded text-xs border-l-2 border-cyan-500">
                        <div className="text-cyan-400 font-mono text-xs">{log.time}</div>
                        <div className="text-slate-300 mt-1">{log.message}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Vote Success */}
              {voteSuccess && (
                <div className="mt-6 bg-gradient-to-r from-green-500/20 to-yellow-500/20 border-2 border-green-500 rounded-lg p-4 animate-pulse">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <h4 className="text-green-400 font-bold">✅ Vote Success!</h4>
                  </div>
                  <div className="text-sm text-slate-300 space-y-1">
                    <p>Voted for: <span className="text-green-400 font-bold">{voteSuccess.option}</span></p>
                    <p>Earned: <span className="text-yellow-400 font-bold">+{voteSuccess.points} Points</span></p>
                    <p>Total: <span className="text-cyan-400 font-bold">{voteSuccess.total} Points</span></p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Reward Popup */}
      <RewardsDisplay showReward={showReward} userRewards={userRewards} />
    </div>
  );
}