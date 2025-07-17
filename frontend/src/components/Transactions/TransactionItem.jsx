// TransactionItem.jsx - Enhanced with better light mode styling
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PencilIcon, TrashIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import toast from 'react-hot-toast';

const TransactionItem = ({ transaction, edit, fetchTransactions, onEdit, index }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await api.delete(`/transactions/${transaction._id}`);
      toast.success('Transaction deleted successfully!', {
        duration: 3000,
        style: {
          background: '#10B981',
          color: '#fff',
          borderRadius: '12px',
          padding: '16px',
          fontSize: '14px',
          fontWeight: '600',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#10B981',
        },
      });
      fetchTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Failed to delete transaction', {
        duration: 4000,
        style: {
          background: '#EF4444',
          color: '#fff',
          borderRadius: '12px',
          padding: '16px',
          fontSize: '14px',
          fontWeight: '600',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#EF4444',
        },
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(transaction);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getCategoryIcon = (category) => {
    const icons = {
      food: '🍕',
      transport: '🚗',
      entertainment: '🎬',
      utilities: '⚡',
      shopping: '🛍️',
      healthcare: '🏥',
      salary: '💰',
      freelance: '💼',
      business: '🏢',
      investment: '📈',
      bonus: '🎁',
      other: '📝'
    };
    return icons[category] || '📝';
  };

  const getCategoryColor = (category) => {
    const colors = {
      food: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
      transport: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      entertainment: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
      utilities: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      shopping: 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300',
      healthcare: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      salary: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300',
      freelance: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300',
      business: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-300',
      investment: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
      bonus: 'bg-rose-100 text-rose-800 dark:bg-rose-900/20 dark:text-rose-300',
      other: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
    };
    return colors[category] || colors.other;
  };

  const amountColor = transaction.type === 'income' 
    ? 'text-green-600 dark:text-green-400' 
    : 'text-red-600 dark:text-red-400';

  const amountPrefix = transaction.type === 'income' ? '+' : '-';

  return (
    <motion.div
      className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-blue-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut"
      }}
      layout
    >
      <div className="flex items-center justify-between">
        {/* Left side - Category and Description */}
        <div className="flex items-center space-x-4 flex-1">
          {/* Category Icon */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-xl">
              {getCategoryIcon(transaction.category)}
            </div>
          </div>

          {/* Transaction Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(transaction.category)}`}>
                {transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)}
              </span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                transaction.type === 'income' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' 
                  : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
              }`}>
                {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
              </span>
            </div>
            
            <h3 className="text-lg font-semibold text-blue-900 dark:text-slate-200 font-sans truncate">
              {transaction.description || 'No description'}
            </h3>
            
            <p className="text-blue-700 dark:text-slate-400 text-sm font-sans">
              {formatDate(transaction.date)}
            </p>
          </div>
        </div>

        {/* Right side - Amount and Actions */}
        <div className="flex items-center space-x-4">
          {/* Amount */}
          <motion.div 
            className="text-right"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
          >
            <div className={`text-2xl font-bold ${amountColor} font-sans`}>
              {amountPrefix}${Math.abs(parseFloat(transaction.amount)).toFixed(2)}
            </div>
          </motion.div>

          {/* Action Buttons */}
          {edit && (
            <div className="flex items-center space-x-2">
              <motion.button
                onClick={handleEdit}
                className="p-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Edit transaction"
              >
                <PencilIcon className="h-5 w-5" />
              </motion.button>

              <motion.button
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Delete transaction"
              >
                {isDeleting ? (
                  <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <TrashIcon className="h-5 w-5" />
                )}
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TransactionItem;
