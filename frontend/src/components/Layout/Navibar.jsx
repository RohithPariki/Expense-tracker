// Navibar.jsx - Enhanced with better light mode styling
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const Navbar = ({ darkMode, setDarkMode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-slate-900 shadow-lg px-6 py-4 flex justify-between items-center border-b border-blue-200 dark:border-slate-700">
      <Link to="/" className="text-2xl font-bold text-blue-900 dark:text-slate-200 font-sans">
        Expense Tracker
      </Link>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setDarkMode((d) => !d)}
          className="p-3 rounded-xl bg-blue-100 dark:bg-slate-800 hover:bg-blue-200 dark:hover:bg-slate-700 transition-colors border border-blue-300 dark:border-slate-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <SunIcon className="h-5 w-5 text-blue-700 dark:text-yellow-400" />
          ) : (
            <MoonIcon className="h-5 w-5 text-blue-700 dark:text-slate-300" />
          )}
        </button>
        {user ? (
          <>
            <span className="text-lg text-blue-900 dark:text-slate-200 font-semibold font-sans">Hi, {user.name}!</span>
            <Link to="/dashboard" className="px-4 py-2 rounded-xl text-base font-semibold bg-blue-600 dark:bg-slate-700 text-white dark:text-slate-200 border border-blue-600 dark:border-slate-600 hover:bg-blue-700 dark:hover:bg-slate-600 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-sans" aria-current="page">
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl text-base font-semibold bg-red-600 text-white border border-red-600 hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 font-sans"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="px-4 py-2 rounded-xl text-base font-semibold bg-blue-600 dark:bg-slate-700 text-white dark:text-slate-200 border border-blue-600 dark:border-slate-600 hover:bg-blue-700 dark:hover:bg-slate-600 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-sans">
              Login
            </Link>
            <Link to="/register" className="px-4 py-2 rounded-xl text-base font-semibold bg-blue-600 dark:bg-slate-700 text-white dark:text-slate-200 border border-blue-600 dark:border-slate-600 hover:bg-blue-700 dark:hover:bg-slate-600 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-sans">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;