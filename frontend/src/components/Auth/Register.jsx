// components/Auth/Register.jsx - Updated to match app design
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  EnvelopeIcon, 
  LockClosedIcon,
  UserIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [mounted, setMounted] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      console.log('Attempting registration with:', formData);
      const response = await registerUser(formData);
      console.log('Registration response:', response);

      // Handle the backend response structure
      if (response.data && response.data.success && response.data.data) {
        const userData = response.data.data;
        
        if (userData.token) {
          login(userData);
          navigate('/dashboard');
        } else {
          throw new Error('No token received from server');
        }
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (err) {
      console.error('Registration error:', err);
      
      // Handle different error response structures
      let errorMessage = 'Registration failed. Please try again.';
      
      if (err.response) {
        // Server responded with error status
        if (err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.status === 400) {
          errorMessage = 'User already exists or invalid data.';
        } else if (err.response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }
      } else if (err.request) {
        // Network error
        errorMessage = 'Network error. Please check your connection.';
      } else if (err.message) {
        // Other error
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.name && formData.email && formData.password && formData.password.length >= 6;

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      {/* Main Container */}
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-500 dark:to-indigo-600 rounded-3xl shadow-2xl mb-6 transform hover:scale-110 transition-transform duration-300">
            <SparklesIcon className="h-12 w-12 text-white drop-shadow-lg" />
          </div>
          <h1 className="text-4xl font-extrabold text-blue-900 dark:text-slate-200 mb-3">
            Join Us
          </h1>
          <p className="text-blue-700 dark:text-slate-400 text-lg">
            Create your account
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow-xl border border-blue-200 dark:border-slate-700 p-8">
          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl">
              <div className="flex items-center space-x-3">
                <ExclamationTriangleIcon className="h-5 w-5" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="block text-blue-900 dark:text-slate-200 text-sm font-semibold">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-all duration-300 ${
                  focusedField === 'name' ? 'text-blue-500' : 'text-gray-400 dark:text-slate-500'
                }`} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  disabled={loading}
                  required
                  className={`w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-700 border-2 rounded-xl text-blue-900 dark:text-slate-200 placeholder-gray-500 dark:placeholder-slate-400 transition-all duration-300 ${
                    focusedField === 'name'
                      ? 'border-blue-500 ring-2 ring-blue-500/20'
                      : 'border-gray-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-slate-500'
                  } focus:outline-none disabled:opacity-50`}
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-blue-900 dark:text-slate-200 text-sm font-semibold">
                Email Address
              </label>
              <div className="relative">
                <EnvelopeIcon className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-all duration-300 ${
                  focusedField === 'email' ? 'text-blue-500' : 'text-gray-400 dark:text-slate-500'
                }`} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  disabled={loading}
                  required
                  className={`w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-700 border-2 rounded-xl text-blue-900 dark:text-slate-200 placeholder-gray-500 dark:placeholder-slate-400 transition-all duration-300 ${
                    focusedField === 'email'
                      ? 'border-blue-500 ring-2 ring-blue-500/20'
                      : 'border-gray-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-slate-500'
                  } focus:outline-none disabled:opacity-50`}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-blue-900 dark:text-slate-200 text-sm font-semibold">
                Password
              </label>
              <div className="relative">
                <LockClosedIcon className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-all duration-300 ${
                  focusedField === 'password' ? 'text-blue-500' : 'text-gray-400 dark:text-slate-500'
                }`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  disabled={loading}
                  required
                  minLength={6}
                  className={`w-full pl-12 pr-12 py-3 bg-white dark:bg-slate-700 border-2 rounded-xl text-blue-900 dark:text-slate-200 placeholder-gray-500 dark:placeholder-slate-400 transition-all duration-300 ${
                    focusedField === 'password'
                      ? 'border-blue-500 ring-2 ring-blue-500/20'
                      : 'border-gray-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-slate-500'
                  } focus:outline-none disabled:opacity-50`}
                  placeholder="Enter your password (min 6 chars)"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading || !isFormValid}
              className={`w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform flex items-center justify-center space-x-3 ${
                loading || !isFormValid
                  ? 'bg-gray-400 cursor-not-allowed opacity-50'
                  : 'bg-blue-600 hover:bg-blue-700 hover:scale-105 shadow-lg hover:shadow-xl'
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRightIcon className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-blue-700 dark:text-slate-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;