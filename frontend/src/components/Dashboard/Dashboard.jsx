// Dashboard.jsx - Fixed and improved
import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { getTransactions } from '../../services/api';
import TransactionForm from './TransactionForm';
import ExpenseChart from '../Charts/ExpenseChart';
import { useAuth } from '../../context/AuthContext';
import TransactionList from '../Transactions/TransactionList';
import TransactionEditModal from '../Transactions/TransactionEditModel';
import CategoryFilter from '../Filter/CategoryFilter';
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
  const [selectedCategory, setSelectedCategory] = useState('all');

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

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Filter transactions by selected category (for transaction list only)
  const filteredTransactions = selectedCategory === 'all'
    ? transactions
    : transactions.filter(t => t.category === selectedCategory);

  if (loading && transactions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-blue-600 dark:text-blue-400 font-medium text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Welcome Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 p-8 rounded-3xl shadow-xl border border-blue-200 dark:border-slate-700 flex flex-col items-center text-center mb-8">
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 rounded-full p-4 shadow-lg border-4 border-blue-300 dark:border-blue-600">
          <span className="text-4xl md:text-5xl">💸</span>
        </div>
        <h1 className="mt-8 text-4xl md:text-5xl font-extrabold text-blue-900 dark:text-slate-200">Welcome to Expense Tracker!</h1>
        <p className="mt-4 text-lg md:text-xl text-blue-700 dark:text-slate-300 max-w-2xl mx-auto">
          Effortlessly track your income and expenses, visualize your financial habits, and take control of your money. Start exploring your dashboard below!
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => scrollToSection('transactions')}
            className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:bg-blue-700 transition"
          >
            View Transactions
          </button>
          <button 
            onClick={() => scrollToSection('charts')}
            className="inline-block bg-white dark:bg-slate-800 text-blue-700 dark:text-slate-300 font-semibold px-6 py-3 rounded-xl border-2 border-blue-300 dark:border-slate-600 shadow hover:bg-blue-50 dark:hover:bg-slate-700 transition"
          >
            See Insights
          </button>
        </div>
      </section>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl">
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Transaction Form - Full Width */}
      <div className="w-full max-w-4xl mx-auto mb-8">
        <div className="bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow-xl border border-blue-200 dark:border-slate-700 p-8">
          <TransactionForm fetchTransactions={fetchTransactions} />
        </div>
      </div>

      {/* Expense Chart - Below Form */}
      <div id="charts" className="w-full max-w-6xl mx-auto mb-8">
        <div className="bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow-xl border border-blue-200 dark:border-slate-700 p-8">
          {/* Pass all transactions to chart, not filtered ones */}
          <ExpenseChart transactions={transactions} />
        </div>
      </div>

      {/* Transactions Section */}
      <div id="transactions" className="bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow-xl border border-blue-200 dark:border-slate-700">
        <div className="p-8 border-b border-blue-200 dark:border-slate-700">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-blue-900 dark:text-slate-200 font-sans">Your Transactions</h2>
              <p className="text-blue-700 dark:text-slate-400 mt-2 font-sans text-lg">
                {filteredTransactions.length} transactions found
              </p>
            </div>
            <div className="flex gap-3 items-center justify-end">
              <button
                onClick={toggleEditMode}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold text-base shadow-lg transition-all duration-200 bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-sans ${edit ? 'bg-green-600 hover:bg-green-700' : ''}`}
              >
                {edit ? (
                  <>
                    <CheckIcon className="h-5 w-5" /> Done
                  </>
                ) : (
                  <>
                    <PencilSquareIcon className="h-5 w-5" /> Edit
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Category Filter */}
          <CategoryFilter 
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>
        <div className="p-8">
          <TransactionList 
            transactions={filteredTransactions} 
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
