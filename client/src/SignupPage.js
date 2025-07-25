// CHALDAL/client/src/SignupPage.js
import React, { useState } from 'react';

// Renamed from App to SignupPage to avoid conflicts
const SignupPage = ({ onClose }) => { // Accept onClose prop
  // State variables for each input field
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Basic client-side password confirmation
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    } else {
      setPasswordError("");
    }

    // For now, just log the collected data to the console.
    // You will integrate this with your backend API later.
    console.log('Signup Data:', {
      name,
      phone,
      email,
      username,
      password, // In a real app, never send plain password directly to backend without hashing
    });

    // You can add a success message or clear the form here if needed
    alert('Signup data collected. Check console for details. (Backend integration pending)');
    // Optionally clear form fields after submission
    setName('');
    setPhone('');
    setEmail('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    onClose(); // Close the modal after successful submission (or handle error)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-200 transform transition-all duration-300 hover:scale-[1.01]">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-800 mb-8 select-none">
          Create Your Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Phone Input */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel" // Use type="tel" for phone numbers
              id="phone"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
              placeholder="+8801XXXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Username Input */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
              placeholder="Choose a unique username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
              placeholder="Min 4 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="4"
            />
          </div>

          {/* Confirm Password Input */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className={`mt-1 block w-full px-4 py-2 border ${passwordError ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200`}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {passwordError && (
              <p className="mt-1 text-sm text-red-600">{passwordError}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-[1.02] active:scale-95"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage; // Export as SignupPage