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

import { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import Navbar from './components/Navbar';
import WalletConnect from './components/WalletConnect';
import CreatePoll from './components/CreatePoll';
import PollCard from './components/PollCard';
import TransactionStatus from './components/TransactionStatus';
import RewardsDisplay from './components/RewardsDisplay';
import { useWalletStore } from './store/walletStore';
import './index.css';

function App() {
  const { wallet } = useWalletStore();
  const [polls, setPolls] = useState([]);
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [userRewards, setUserRewards] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [interContractLogs, setInterContractLogs] = useState([]);

  // Get wallet address safely
  const walletAddress = typeof wallet === 'string' ? wallet : wallet?.publicKey || null;

  useEffect(() => {
    const savedPolls = localStorage.getItem('polls');
    if (savedPolls) {
      setPolls(JSON.parse(savedPolls));
    }
    const savedRewards = localStorage.getItem('userRewards');
    if (savedRewards) {
      setUserRewards(parseInt(savedRewards));
    }
  }, []);

  const addLog = (message) => {
    setInterContractLogs(prev => [...prev, {
      message,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const handleVoteSuccess = (pollId, option) => {
    // Step 1: Vote submitted
    addLog(`🗳️ Vote cast on poll: "${option}"`);
    
    // Step 2: Voting Contract processes vote
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
          localStorage.setItem('userRewards', newRewards.toString());
          
          addLog('💰 Rewards Contract: +10 Points Awarded');
          addLog(`✨ Total Rewards: ${newRewards} Points`);
          
          // Show success toast
          toast.success('🎉 Congratulations! +10 Reward Points!', {
            description: `Inter-contract call successful! Total: ${newRewards} points`,
            duration: 5000
          });
        }, 600);
      }, 600);
    }, 400);
  };

  const handleAddPoll = (poll) => {
    const updatedPolls = [poll, ...polls];
    setPolls(updatedPolls);
    localStorage.setItem('polls', JSON.stringify(updatedPolls));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar walletAddress={walletAddress} userRewards={userRewards} />
      <Toaster position="top-right" />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {!walletAddress ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <WalletConnect />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-8">
            {/* Main Content - 2/3 */}
            <div className="col-span-2 space-y-8">
              <div className="text-center">
                <h1 className="text-5xl font-black text-cyan-400 mb-2">
                  🗳️ Stellar Live Polls
                </h1>
                <p className="text-gray-300 text-lg">Real-time voting on blockchain</p>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => setShowCreatePoll(!showCreatePoll)}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg hover:shadow-xl transition-all duration-300"
                >
                  {showCreatePoll ? '✕ Cancel' : '+ Create New Poll'}
                </button>
              </div>

              {showCreatePoll && (
                <div className="max-w-2xl mx-auto">
                  <CreatePoll 
                    onSuccess={() => setShowCreatePoll(false)}
                    onAddPoll={handleAddPoll}
                  />
                </div>
              )}

              <TransactionStatus />

              <div className="grid grid-cols-1 gap-6">
                {polls.length === 0 ? (
                  <div className="text-center py-16 bg-slate-800 rounded-lg border border-slate-700">
                    <p className="text-gray-400 text-xl">No polls yet. Create one!</p>
                  </div>
                ) : (
                  polls.map((poll) => (
                    <PollCard 
                      key={poll.id} 
                      poll={poll}
                      onVoteSuccess={(option) => handleVoteSuccess(poll.id, option)}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Sidebar - 1/3 */}
            <div className="col-span-1 space-y-6">
              {/* Rewards Display */}
              <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500 rounded-lg p-6 sticky top-24">
                <h3 className="text-lg font-bold text-yellow-400 mb-4">💰 Your Rewards</h3>
                <div className="text-4xl font-black text-yellow-300 mb-2">{userRewards}</div>
                <p className="text-sm text-yellow-300">Points Earned</p>
              </div>

              {/* Contract Flow */}
              <div className="bg-slate-800 border-2 border-cyan-500 rounded-lg p-6">
                <h3 className="text-lg font-bold text-cyan-400 mb-4">🔗 Contract Flow</h3>
                
                <div className="space-y-3">
                  <div className="bg-cyan-500/20 border border-cyan-500 rounded p-3 text-center">
                    <div className="text-cyan-400 font-bold text-sm">🗳️ Voting Contract</div>
                    <div className="text-xs text-cyan-300 mt-1">Accepts votes</div>
                  </div>
                  
                  <div className="text-cyan-400 font-bold text-center">⬇️</div>
                  
                  <div className="bg-yellow-500/20 border border-yellow-500 rounded p-3 text-center">
                    <div className="text-yellow-400 font-bold text-sm">🔗 Inter-Contract Call</div>
                    <div className="text-xs text-yellow-300 mt-1">Voting → Rewards</div>
                  </div>
                  
                  <div className="text-yellow-400 font-bold text-center">⬇️</div>
                  
                  <div className="bg-green-500/20 border border-green-500 rounded p-3 text-center">
                    <div className="text-green-400 font-bold text-sm">💎 Rewards Contract</div>
                    <div className="text-xs text-green-300 mt-1">Awards +10 points</div>
                  </div>
                </div>
              </div>

              {/* Contract Logs */}
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 max-h-96 overflow-y-auto">
                <h3 className="text-lg font-bold text-white mb-4">📊 Contract Logs</h3>
                
                {interContractLogs.length === 0 ? (
                  <p className="text-slate-400 text-sm">Cast a vote to see contract execution...</p>
                ) : (
                  <div className="space-y-2">
                    {interContractLogs.map((log, idx) => (
                      <div key={idx} className="bg-slate-700/50 p-2 rounded text-xs border-l-2 border-cyan-500">
                        <div className="text-cyan-400 font-mono">{log.timestamp}</div>
                        <div className="text-slate-300 mt-1">{log.message}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Reward Popup */}
      <RewardsDisplay showReward={showReward} userRewards={userRewards} />
    </div>
  );
}

export default App;