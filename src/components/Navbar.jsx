// import { useWalletStore } from '../store/walletStore';
// import { disconnectWallet } from '../services/walletService';

// export default function Navbar() {
//   const { wallet, walletName, clearWallet } = useWalletStore();

//   const handleDisconnect = () => {
//     disconnectWallet();
//     clearWallet();
//   };

//   return (
//     <nav className="bg-black/40 backdrop-blur-md border-b border-cyan-500/20 sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
//         <div className="flex items-center gap-2">
//           <span className="text-3xl">🗳️</span>
//           <h1 className="text-2xl font-black text-cyan-400">
//             Live Polls
//           </h1>
//         </div>

//         <div className="flex items-center gap-4">
//           {wallet && (
//             <>
//               <div className="hidden md:block text-right">
//                 <p className="text-xs text-gray-400">Connected with</p>
//                 <p className="text-sm font-bold text-cyan-400">{walletName}</p>
//                 <p className="text-xs text-gray-500">{wallet.address?.slice(0, 10)}...</p>
//               </div>
//               <button
//                 onClick={handleDisconnect}
//                 className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition"
//               >
//                 Disconnect
//               </button>
//             </>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// }

import { useWalletStore } from '../store/walletStore';
import { Gift } from 'lucide-react';

export default function Navbar({ walletAddress, userRewards }) {
  const { disconnect } = useWalletStore();

  const displayAddress = typeof walletAddress === 'string' 
    ? `${walletAddress.substring(0, 8)}...${walletAddress.substring(-6)}`
    : 'Connected';

  return (
    <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-cyan-400">🗳️ Stellar Live Polls</h1>
        
        <div className="flex items-center gap-4">
          {walletAddress && (
            <>
              <div className="bg-yellow-500/20 border border-yellow-500/50 px-4 py-2 rounded-lg flex items-center gap-2">
                <Gift className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-300 font-bold">{userRewards || 0}</span>
                <span className="text-yellow-300 text-sm">Points</span>
              </div>
              
              <div className="bg-cyan-500/10 border border-cyan-500/50 px-4 py-2 rounded-lg">
                <p className="text-cyan-400 text-sm font-mono">
                  {displayAddress}
                </p>
              </div>
              
              <button
                onClick={disconnect}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition"
              >
                Disconnect
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}