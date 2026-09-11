import React, { useState } from 'react';
import { LuEye, LuEyeOff } from 'react-icons/lu';

interface LoginFormProps {
  onSwitchToSignUp: () => void;
  onForgotPassword: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignUp, onForgotPassword }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto flex flex-col justify-center h-full">
      <h2 className="text-4xl font-semibold text-white mb-2">Welcome back</h2>
      <p className="text-gray-400 text-sm mb-8">
        Don't have an account?{' '}
        <button onClick={onSwitchToSignUp} className="text-white underline hover:text-gray-300 transition-colors">
          Sign up
        </button>
      </p>

      <form className="space-y-4">
        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-3 bg-[#2D2D3A] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#7C5CFC] transition-colors"
        />

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            className="w-full px-4 py-3 bg-[#2D2D3A] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#7C5CFC] transition-colors pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            {showPassword ? <LuEyeOff size={20} /> : <LuEye size={20} />}
          </button>
        </div>

        {/* Forgot password link */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm text-gray-400 hover:text-white underline transition-colors"
          >
            Forgot password?
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3.5 mt-2 bg-[#7C5CFC] hover:bg-[#6B4EE6] text-white font-medium rounded-lg transition-colors"
        >
          Log in
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center my-6">
        <div className="flex-1 h-px bg-gray-600" />
        <span className="px-4 text-xs text-gray-400">Or continue with</span>
        <div className="flex-1 h-px bg-gray-600" />
      </div>

      {/* Social Buttons */}
      <div className="flex gap-4">
        <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-600 rounded-lg text-white hover:bg-white/5 transition-colors">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Google
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-600 rounded-lg text-white hover:bg-white/5 transition-colors">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
          </svg>
          Apple
        </button>
      </div>
    </div>
  );
};

export default LoginForm

