// TransactionForm.jsx - Now supports both add and edit modes
import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

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
        toast.success('Transaction updated successfully!');
      } else {
        // CREATE new transaction
        response = await api.post('/transactions', payload);
        toast.success('Transaction added successfully!');
      }

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
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const currentCategories = categories[formData.type] || categories.expense;

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
      {title && <h3 className="text-xl font-bold text-gray-800 mb-6">{title}</h3>}
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Type & Category Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Transaction Type
            </label>
            <select 
              name="type" 
              value={formData.type} 
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
              required
            >
              <option value="expense">💸 Expense</option>
              <option value="income">💰 Income</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category
            </label>
            <select 
              name="category" 
              value={formData.category} 
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
              required
            >
              <option value="">Select Category</option>
              {currentCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Amount ($)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500 text-lg">$</span>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="0.00"
              required
              min="0"
              step="0.01"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
            placeholder="Enter transaction details..."
            
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {isEditing ? 'Updating...' : 'Adding...'}
              </div>
            ) : (
              submitButtonText
            )}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
