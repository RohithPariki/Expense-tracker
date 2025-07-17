// CategoryFilter.jsx - Enhanced with better light mode styling
import React from 'react';
import { motion } from 'framer-motion';

const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
  const categories = [
    { id: 'all', name: 'All', icon: '📊', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' },
    { id: 'food', name: 'Food', icon: '🍕', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' },
    { id: 'transport', name: 'Transport', icon: '🚗', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300' },
    { id: 'utilities', name: 'Utilities', icon: '⚡', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' },
    { id: 'shopping', name: 'Shopping', icon: '🛍️', color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300' },
    { id: 'healthcare', name: 'Healthcare', icon: '🏥', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' },
    { id: 'salary', name: 'Salary', icon: '💰', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300' },
    { id: 'freelance', name: 'Freelance', icon: '💼', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300' },
    { id: 'business', name: 'Business', icon: '🏢', color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-300' },
    { id: 'investment', name: 'Investment', icon: '📈', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300' },
    { id: 'bonus', name: 'Bonus', icon: '🎁', color: 'bg-rose-100 text-rose-800 dark:bg-rose-900/20 dark:text-rose-300' },
    { id: 'other', name: 'Other', icon: '📝', color: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300' }
  ];

  return (
    <motion.div 
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-slate-200 font-sans">
            Filter by Category
          </h3>
          <span className="text-sm text-blue-700 dark:text-slate-400 font-sans">
            {selectedCategory === 'all' ? 'Showing all categories' : `Filtered by ${selectedCategory}`}
          </span>
        </div>
        
        <div className="relative">
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm whitespace-nowrap transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                    : `${category.color} hover:scale-105 border border-transparent hover:border-blue-300 dark:hover:border-blue-600`
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  duration: 0.3, 
                  delay: index * 0.05,
                  ease: "easeOut"
                }}
              >
                <span className="text-lg">{category.icon}</span>
                <span className="font-sans">{category.name}</span>
                {selectedCategory === category.id && (
                  <motion.div
                    className="w-2 h-2 bg-white rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
          
          {/* Gradient fade indicators */}
          <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-blue-50 dark:from-slate-800 to-transparent pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-blue-50 dark:from-slate-800 to-transparent pointer-events-none"></div>
        </div>
      </div>
    </motion.div>
  );
};

export default CategoryFilter; 