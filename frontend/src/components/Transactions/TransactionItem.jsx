// TransactionItem.jsx - Final fixed version
import React, { useState } from 'react';
import { formatCurrency, formatDate } from '../../utils/helpers';
import api from '../../services/api';
import { PencilIcon, TrashIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const TransactionItem = ({ transaction, edit, fetchTransactions, onEdit }) => {
  const { _id, type, category, amount, description, date } = transaction;
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleDelete = async () => {
    if (!showConfirmDelete) {
      setShowConfirmDelete(true);
      return;
    }

    try {
      setIsDeleting(true);
      await api.delete(`/transactions/${_id}`);
      toast.success('Transaction deleted successfully');
      fetchTransactions();
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error('Failed to delete transaction');
    } finally {
      setIsDeleting(false);
      setShowConfirmDelete(false);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(transaction);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      food: '🍽️',
      transport: '🚗',
      entertainment: '🎬',
      utilities: '💡',
      shopping: '🛍️',
      healthcare: '🏥',
      salary: '💰',
      freelance: '💻',
      business: '🏢',
      investment: '📈',
      bonus: '🎁',
      other: '📝'
    };
    return icons[category] || '📝';
  };

  return (
    <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 overflow-hidden">
      {/* Edit/Delete buttons overlay */}
      {edit && (
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <button
            onClick={handleEdit}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm"
            aria-label={`Edit transaction: ${category} - ${description}`}
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          
          {!showConfirmDelete ? (
            <button
              onClick={handleDelete}
              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-sm"
              aria-label={`Delete transaction: ${category} - ${description}`}
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          ) : (
            <div className="flex gap-1">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-sm"
                aria-label="Confirm delete"
              >
                {isDeleting ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                ) : (
                  <CheckIcon className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                aria-label="Cancel delete"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Transaction content */}
      <div className={`p-6 ${edit ? 'pr-24' : ''}`}>
        <div className="flex items-center gap-4">
          {/* Category Icon */}
          <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl ${
            type === 'income' ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {getCategoryIcon(category)}
          </div>

          {/* Transaction Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-800 text-lg capitalize truncate">
                  {category}
                </h3>
                <p className="text-gray-600 text-sm truncate mt-1">
                  {description}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {formatDate(date)}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    type === 'income' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {type === 'income' ? '💰 Income' : '💸 Expense'}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                <div className={`text-2xl font-bold ${
                  type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {type === 'income' ? '+' : '-'}{formatCurrency(amount)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;
