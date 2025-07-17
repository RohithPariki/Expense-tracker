// TransactionList.jsx - Enhanced with better light mode styling
import React, { useState } from 'react';
import TransactionItem from './TransactionItem';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const TransactionList = ({ transactions, edit, fetchTransactions, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Filter transactions based on search term
  const filteredTransactions = transactions.filter(transaction =>
    transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.amount?.toString().includes(searchTerm)
  );

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'amount':
        aValue = Math.abs(parseFloat(a.amount));
        bValue = Math.abs(parseFloat(b.amount));
        break;
      case 'category':
        aValue = a.category?.toLowerCase();
        bValue = b.category?.toLowerCase();
        break;
      case 'date':
      default:
        aValue = new Date(a.date);
        bValue = new Date(b.date);
        break;
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  if (transactions.length === 0) {
    return (
      <motion.div 
        className="w-full text-center py-16"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">📝</span>
        </div>
        <h3 className="text-2xl font-bold text-blue-900 dark:text-slate-200 mb-3 font-sans">
          No Transactions Yet
        </h3>
        <p className="text-blue-700 dark:text-slate-400 text-lg font-sans max-w-md mx-auto">
          Start tracking your expenses by adding your first transaction above.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="w-full space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Search and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-600 dark:text-blue-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-700 border border-blue-200 dark:border-slate-600 rounded-xl text-blue-900 dark:text-slate-200 font-sans placeholder-blue-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base shadow-sm"
          />
        </div>

        {/* Sort Controls */}
        <div className="flex gap-2">
          {[
            { key: 'date', label: 'Date' },
            { key: 'amount', label: 'Amount' },
            { key: 'category', label: 'Category' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleSort(key)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                sortBy === key
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-blue-50 dark:bg-slate-700 text-blue-700 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-slate-600 border border-blue-200 dark:border-slate-600'
              }`}
            >
              {label}
              {sortBy === key && (
                <span className="ml-1">
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      {searchTerm && (
        <motion.div 
          className="text-blue-700 dark:text-slate-400 text-sm font-medium"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Found {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
          {searchTerm && ` matching "${searchTerm}"`}
        </motion.div>
      )}

      {/* Transactions List */}
      <AnimatePresence mode="wait">
        {sortedTransactions.length === 0 ? (
          <motion.div 
            key="no-results"
            className="text-center py-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="text-lg font-semibold text-blue-900 dark:text-slate-200 mb-2 font-sans">
              No matching transactions
            </h3>
            <p className="text-blue-700 dark:text-slate-400 font-sans">
              Try adjusting your search terms or filters.
            </p>
          </motion.div>
        ) : (
          <motion.div 
            key="transactions"
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {sortedTransactions.map((transaction, index) => (
              <motion.div
                key={transaction._id}
                variants={itemVariants}
                layout
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }}
              >
                <TransactionItem
                  transaction={transaction}
                  edit={edit}
                  fetchTransactions={fetchTransactions}
                  onEdit={onEdit}
                  index={index}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary */}
      <motion.div 
        className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-blue-700 dark:text-blue-400 text-sm font-semibold font-sans">Total Transactions</p>
            <p className="text-blue-900 dark:text-blue-300 text-2xl font-bold font-sans">
              {transactions.length}
            </p>
          </div>
          <div>
            <p className="text-green-700 dark:text-green-400 text-sm font-semibold font-sans">Total Income</p>
            <p className="text-green-900 dark:text-green-300 text-2xl font-bold font-sans">
              ${transactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + parseFloat(t.amount), 0)
                .toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-red-700 dark:text-red-400 text-sm font-semibold font-sans">Total Expenses</p>
            <p className="text-red-900 dark:text-red-300 text-2xl font-bold font-sans">
              ${transactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + parseFloat(t.amount), 0)
                .toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-purple-700 dark:text-purple-400 text-sm font-semibold font-sans">Net Balance</p>
            <p className={`text-2xl font-bold font-sans ${
              transactions.reduce((sum, t) => 
                sum + (t.type === 'income' ? parseFloat(t.amount) : -parseFloat(t.amount)), 0
              ) >= 0 
                ? 'text-green-900 dark:text-green-300' 
                : 'text-red-900 dark:text-red-300'
            }`}>
              ${transactions
                .reduce((sum, t) => 
                  sum + (t.type === 'income' ? parseFloat(t.amount) : -parseFloat(t.amount)), 0
                )
                .toFixed(2)}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TransactionList;
