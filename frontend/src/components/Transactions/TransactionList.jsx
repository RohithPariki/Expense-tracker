// TransactionList.jsx - Enhanced with better styling
import React from 'react';
import TransactionItem from './TransactionItem';
import { BanknotesIcon } from '@heroicons/react/24/outline';

const TransactionList = ({ transactions, edit, fetchTransactions, onEdit }) => {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <BanknotesIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-500 text-lg">No transactions found</p>
        <p className="text-gray-400 text-sm mt-1">Start by adding your first transaction above</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <TransactionItem
          key={transaction._id}
          transaction={transaction}
          edit={edit}
          fetchTransactions={fetchTransactions}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};

export default TransactionList;
