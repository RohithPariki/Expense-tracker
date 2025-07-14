// TransactionEditModal.jsx - Modal for editing transactions
import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Edit Transaction</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <XMarkIcon className="h-6 w-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-6">
          <TransactionForm
            initialData={transaction}
            onSuccess={handleSuccess}
            onCancel={onClose}
            isEditing={true}
            submitButtonText="Update Transaction"
            title=""
          />
        </div>
      </div>
    </div>
  );
};

export default TransactionEditModal;
