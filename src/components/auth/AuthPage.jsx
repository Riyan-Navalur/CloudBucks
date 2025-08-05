import React, { useState } from 'react'
import LoginForm from './LoginForm'
import SignUpForm from './SignUpForm'

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false)

  const toggleForm = () => {
    setIsSignUp(!isSignUp)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo/Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">CloudBucks</h1>
          <p className="text-gray-600 mt-2">Cloud Cost Comparison Platform</p>
        </div>

        {/* Auth Forms */}
        {isSignUp ? (
          <SignUpForm onToggleForm={toggleForm} />
        ) : (
          <LoginForm onToggleForm={toggleForm} />
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>&copy; 2024 CloudBucks. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default AuthPage 