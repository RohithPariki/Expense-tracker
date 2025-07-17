// TransactionForm.jsx - Now supports both add and edit modes
import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';

const TransactionForm = ({ 
  fetchTransactions, 
  initialData = null, 
  onSuccess = null, 
  onCancel = null,
  isEditing = false,
  submitButtonText = "Add Transaction",
  title = "Add New Transaction"
}) => {
  const [formData, setFormData] = useState({
    type: 'expense',
    category: '',
    amount: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const categories = {
    expense: ['food', 'transport', 'entertainment', 'utilities', 'shopping', 'healthcare', 'other'],
    income: ['salary', 'freelance', 'business', 'investment', 'bonus', 'other']
  };

  // Initialize form with existing data when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        type: initialData.type || 'expense',
        category: initialData.category || '',
        amount: initialData.amount?.toString() || '',
        description: initialData.description || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      // Reset category when type changes
      if (name === 'type' && value !== prev.type) {
        newData.category = '';
      }
      return newData;
    });
  };

  const validateForm = () => {
    if (!formData.category) {
      setError('Please select a category');
      return false;
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
        date: initialData?.date || new Date(),
      };

      let response;
      if (isEditing && initialData?._id) {
        // UPDATE existing transaction using PUT
        response = await api.put(`/transactions/${initialData._id}`, payload);
        toast.success('Transaction updated successfully!', {
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
      } else {
        // CREATE new transaction
        response = await api.post('/transactions', payload);
        toast.success('Transaction added successfully!', {
          duration: 3000,
          style: {
            background: '#3B82F6',
            color: '#fff',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
            fontWeight: '600',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#3B82F6',
          },
        });
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 1200);

      // Reset form if not editing
      if (!isEditing) {
        setFormData({
          type: 'expense',
          category: '',
          amount: '',
          description: ''
        });
      }

      // Call success callbacks
      if (onSuccess) {
        onSuccess(response.data);
      }
      if (fetchTransactions) {
        fetchTransactions();
      }

    } catch (err) {
      console.error('Error saving transaction:', err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          'Failed to save transaction';
      setError(errorMessage);
      toast.error(errorMessage, {
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
      setLoading(false);
    }
  };

  const currentCategories = categories[formData.type] || categories.expense;

  return (
    <motion.div 
      className="w-full h-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {title && (
        <motion.h3 
          className="text-3xl font-bold text-blue-900 dark:text-slate-200 mb-8 font-sans text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {title}
        </motion.h3>
      )}
      
      <AnimatePresence>
        {error && (
          <motion.div 
            className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500 text-red-700 dark:text-red-400 rounded-xl text-sm font-sans"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8 flex-1">
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div>
            <label className="block text-lg font-semibold text-blue-900 dark:text-slate-300 mb-3 font-sans">Transaction Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-6 py-4 bg-white dark:bg-slate-700 border border-blue-200 dark:border-slate-600 rounded-xl text-blue-900 dark:text-slate-200 font-sans placeholder-blue-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base shadow-sm"
              required
            >
              <option value="expense">💸 Expense</option>
              <option value="income">💰 Income</option>
            </select>
          </div>
          <div>
            <label className="block text-lg font-semibold text-blue-900 dark:text-slate-300 mb-3 font-sans">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-6 py-4 bg-white dark:bg-slate-700 border border-blue-200 dark:border-slate-600 rounded-xl text-blue-900 dark:text-slate-200 font-sans placeholder-blue-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base shadow-sm"
              required
            >
              <option value="">Select Category</option>
              {currentCategories.map((cat) => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <label className="block text-lg font-semibold text-blue-900 dark:text-slate-300 mb-3 font-sans">Amount ($)</label>
          <div className="relative">
            <span className="absolute left-6 top-4 text-blue-600 dark:text-blue-400 text-xl font-semibold">$</span>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full pl-12 pr-6 py-4 bg-white dark:bg-slate-700 border border-blue-200 dark:border-slate-600 rounded-xl text-blue-900 dark:text-slate-200 font-sans placeholder-blue-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg font-medium shadow-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="0.00"
              required
              min="0"
              step="0.01"
            />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <label className="block text-lg font-semibold text-blue-900 dark:text-slate-300 mb-3 font-sans">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-6 py-4 bg-white dark:bg-slate-700 border border-blue-200 dark:border-slate-600 rounded-xl text-blue-900 dark:text-slate-200 font-sans placeholder-blue-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none text-base shadow-sm"
            placeholder="Enter transaction details..."
          />
        </motion.div>
        
        <motion.div 
          className="flex gap-4 pt-4 mt-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <motion.button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white rounded-xl px-8 py-4 font-bold font-sans text-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {isEditing ? 'Updating...' : 'Adding...'}
              </div>
            ) : (
              submitButtonText
            )}
          </motion.button>
          {onCancel && (
            <motion.button
              type="button"
              onClick={onCancel}
              className="px-8 py-4 border-2 border-blue-200 dark:border-slate-600 text-blue-700 dark:text-slate-300 rounded-xl font-bold font-sans text-lg hover:bg-blue-50 dark:hover:bg-slate-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
          )}
        </motion.div>
      </form>

      {/* Success Animation */}
      <AnimatePresence>
        {success && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-green-500 text-white p-6 rounded-2xl shadow-2xl flex items-center gap-3"
              initial={{ scale: 0.5, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.5, rotate: 180 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <CheckCircleIcon className="h-8 w-8" />
              <span className="text-lg font-semibold">Success!</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TransactionForm;
