// TransactionEditModal.jsx - Modern Modal for editing transactions
import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import TransactionForm from '../Dashboard/TransactionForm';

const TransactionEditModal = ({ 
  isOpen, 
  onClose, 
  transaction, 
  onSuccess 
}) => {
  if (!isOpen) return null;

  const handleSuccess = (updatedTransaction) => {
    onSuccess(updatedTransaction);
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleBackdropClick}
      >
        {/* Backdrop */}
        <motion.div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
        
        {/* Modal */}
        <motion.div 
          className="relative w-full max-w-4xl max-h-[95vh] bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          {/* Header */}
          <motion.div 
            className="sticky top-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-800 border-b border-slate-200 dark:border-slate-600 px-8 py-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 font-sans">
                    Edit Transaction
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 text-base font-medium">
                    Update transaction details
                  </p>
                </div>
              </div>
              
              <motion.button 
                onClick={onClose}
                className="p-3 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <XMarkIcon className="h-6 w-6 text-slate-500 dark:text-slate-400" />
              </motion.button>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div 
            className="p-8 overflow-y-auto max-h-[calc(95vh-140px)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            {/* Transaction Info Preview */}
            <motion.div 
              className="mb-8 p-6 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-700/50 dark:to-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-600"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-4 font-sans">
                Current Transaction Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${transaction.type === 'expense' ? 'bg-red-500' : 'bg-green-500'}`} />
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Type</p>
                    <p className="text-base font-semibold text-slate-800 dark:text-slate-200 capitalize">
                      {transaction.type}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Category</p>
                  <p className="text-base font-semibold text-slate-800 dark:text-slate-200 capitalize">
                    {transaction.category}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Amount</p>
                  <p className={`text-base font-bold ${transaction.type === 'expense' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                    ${parseFloat(transaction.amount).toFixed(2)}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-600 p-6">
              <TransactionForm
                initialData={transaction}
                onSuccess={handleSuccess}
                onCancel={onClose}
                isEditing={true}
                submitButtonText="Update Transaction"
                title=""
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TransactionEditModal;
