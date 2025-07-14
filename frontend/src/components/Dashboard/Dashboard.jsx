// Dashboard.jsx - Fixed and improved
import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { getTransactions } from '../../services/api';
import TransactionForm from './TransactionForm';
import ExpenseChart from '../Charts/ExpenseChart';
import { useAuth } from '../../context/AuthContext';
import TransactionList from '../Transactions/TransactionList';
import TransactionEditModal from '../Transactions/TransactionEditModel';
import { PencilSquareIcon, CheckIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [edit, setEdit] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { user } = useAuth();
  const [filter, setFilter] = useState({});

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getTransactions();
      console.log('Transactions response:', res.data);
      
      const transactionsData = res.data.data?.transactions || res.data.data || res.data;
      setTransactions(Array.isArray(transactionsData) ? transactionsData : []);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
      setError('Failed to load transactions');
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const toggleEditMode = () => {
    setEdit(!edit);
    if (edit) {
      // Exiting edit mode - refresh data
      fetchTransactions();
      toast.success('Edit mode disabled');
    } else {
      toast.success('Edit mode enabled');
    }
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = (updatedTransaction) => {
    // Update the transaction in the local state
    setTransactions(prevTransactions =>
      prevTransactions.map(t =>
        t._id === updatedTransaction._id ? updatedTransaction : t
      )
    );
    toast.success('Transaction updated successfully!');
    fetchTransactions();
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  if (loading && transactions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-blue-600 font-medium text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
        <p className="text-blue-100">Track your expenses and manage your finances effortlessly</p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Form + Chart Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        <TransactionForm fetchTransactions={fetchTransactions} />
        <ExpenseChart transactions={transactions} />
      </div>

      {/* Transactions Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Your Transactions</h2>
              <p className="text-gray-600 mt-1">
                {transactions.length} transaction{transactions.length !== 1 ? 's' : ''} found
              </p>
            </div>
            <button
              onClick={toggleEditMode}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                edit
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {edit ? (
                <>
                  <CheckIcon className="h-5 w-5" />
                  Done
                </>
              ) : (
                <>
                  <PencilSquareIcon className="h-5 w-5" />
                  Edit
                </>
              )}
            </button>
          </div>
        </div>

        <div className="p-6">
          <TransactionList 
            transactions={transactions} 
            edit={edit} 
            fetchTransactions={fetchTransactions}
            onEdit={handleEditTransaction}
          />
        </div>
      </div>

      {/* Edit Modal */}
      <TransactionEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        transaction={editingTransaction}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
};

export default Dashboard;
