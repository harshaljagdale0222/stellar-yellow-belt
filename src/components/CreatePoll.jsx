import { useState } from 'react';
import { useWalletStore } from '../store/walletStore';
import { useTransactionStore } from '../store/transactionStore';
import { createPoll, submitTransaction } from '../services/contractService';
import { toast } from 'sonner';
import LoadingSpinner from './LoadingSpinner';

export default function CreatePoll({ onSuccess, onAddPoll }) {
  const { wallet } = useWalletStore();
  const { addTransaction, setCurrentTransaction } = useTransactionStore();
  
  const [question, setQuestion] = useState('');
  const [duration, setDuration] = useState(3600);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreatePoll = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      if (!question.trim()) {
        setError('Question cannot be empty');
        return;
      }

      if (question.length > 200) {
        setError('Question must be less than 200 characters');
        return;
      }

      const endTime = Math.floor(Date.now() / 1000) + duration;
      const pollTx = await createPoll(wallet, question, endTime);

      const txData = {
        id: Date.now().toString(),
        hash: null,
        status: 'pending',
        method: 'createPoll',
        question,
        timestamp: new Date().toISOString(),
        walletAddress: wallet.address
      };
      
      addTransaction(txData);
      setCurrentTransaction(txData);

      const submitted = await submitTransaction(wallet, pollTx.xdr);

      addTransaction({
        ...txData,
        hash: submitted.hash,
        status: 'success',
        ledger: submitted.ledger
      });

      toast.success(`✅ Poll created! TX: ${submitted.hash.slice(0, 10)}...`);
      setQuestion('');
      onSuccess?.();

      if (onAddPoll) {
        onAddPoll({
          id: submitted.hash,
          question,
          yesVotes: 0,
          noVotes: 0,
          endTime: new Date(endTime * 1000),
          createdAt: new Date(),
          transactionHash: submitted.hash
        });
      }

    } catch (err) {
      const errorMsg = err.message || 'Failed to create poll';
      setError(errorMsg);
      toast.error(errorMsg);
      console.error('Create poll error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleCreatePoll} className="w-full bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Create a New Poll</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-600/50 rounded text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-300 mb-2">
            📝 Poll Question
          </label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What's your question? (Max 200 characters)"
            maxLength="200"
            disabled={loading}
            className="w-full px-4 py-3 bg-slate-900 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 disabled:opacity-50"
          />
          <p className="text-xs text-gray-500 mt-1">{question.length}/200</p>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-300 mb-2">
            ⏱️ Poll Duration
          </label>
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            disabled={loading}
            className="w-full px-4 py-3 bg-slate-900 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-400 disabled:opacity-50"
          >
            <option value={3600}>1 Hour</option>
            <option value={86400}>1 Day</option>
            <option value={604800}>1 Week</option>
            <option value={2592000}>1 Month</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <LoadingSpinner size="sm" />
              Creating Poll...
            </>
          ) : (
            '🚀 Create Poll'
          )}
        </button>
      </div>
    </form>
  );
}