import React, { useState } from 'react';
import { LuArrowLeft, LuEye, LuEyeOff, LuMail, LuCircleCheck } from 'react-icons/lu';

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}

type Step = 'eLuMail' | 'otp' | 'reset' | 'success';

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBackToLogin }) => {
  const [step, setStep] = useState<Step>('eLuMail');
  const [eLuMail, setELuMail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Handle OTP input
  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      prev?.focus();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col justify-center">
      {/* Back Button */}
      {step !== 'success' && (
        <button
          onClick={step === 'eLuMail' ? onBackToLogin : () => setStep('eLuMail')}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-6 w-fit"
        >
          <LuArrowLeft size={16} />
          {step === 'eLuMail' ? 'Back to login' : 'Back'}
        </button>
      )}

      {/* STEP 1: Enter ELuMail */}
      {step === 'eLuMail' && (
        <>
          <h2 className="text-3xl font-semibold text-white mb-2">Forgot password?</h2>
          <p className="text-gray-400 text-sm mb-8">
            No worries, we'll send you reset instructions.
          </p>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setStep('otp');
            }}
          >
            <div className="relative">
              <LuMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="eLuMail"
                value={eLuMail}
                onChange={(e) => setELuMail(e.target.value)}
                placeholder="Enter your eLuMail"
                required
                className="w-full pl-11 pr-4 py-3 bg-[#2D2D3A] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#7C5CFC] transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 mt-2 bg-[#7C5CFC] hover:bg-[#6B4EE6] text-white font-medium rounded-lg transition-colors"
            >
              Send reset code
            </button>
          </form>
        </>
      )}

      {/* STEP 2: Verify OTP */}
      {step === 'otp' && (
        <>
          <h2 className="text-3xl font-semibold text-white mb-2">Check your eLuMail</h2>
          <p className="text-gray-400 text-sm mb-8">
            We sent a 6-digit code to <span className="text-white">{eLuMail || 'your eLuMail'}</span>.
          </p>

          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              setStep('reset');
            }}
          >
            {/* OTP Boxes */}
            <div className="flex justify-between gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  onKeyDown={(e) => handleOtpKeyDown(e, index)}
                  className="w-12 h-14 text-center text-xl font-semibold bg-[#2D2D3A] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#7C5CFC] transition-colors"
                />
              ))}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#7C5CFC] hover:bg-[#6B4EE6] text-white font-medium rounded-lg transition-colors"
            >
              Verify code
            </button>

            <p className="text-center text-sm text-gray-400">
              Didn't receive the code?{' '}
              <button type="button" className="text-white underline hover:text-gray-300 transition-colors">
                Resend
              </button>
            </p>
          </form>
        </>
      )}

      {/* STEP 3: Reset Password */}
      {step === 'reset' && (
        <>
          <h2 className="text-3xl font-semibold text-white mb-2">Set new password</h2>
          <p className="text-gray-400 text-sm mb-8">
            Must be at least 8 characters.
          </p>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setStep('success');
            }}
          >
            {/* New Password */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
                minLength={8}
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

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                minLength={8}
                className="w-full px-4 py-3 bg-[#2D2D3A] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#7C5CFC] transition-colors pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showConfirm ? <LuEyeOff size={20} /> : <LuEye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 mt-2 bg-[#7C5CFC] hover:bg-[#6B4EE6] text-white font-medium rounded-lg transition-colors"
            >
              Reset password
            </button>
          </form>
        </>
      )}

      {/* STEP 4: Success */}
      {step === 'success' && (
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-[#7C5CFC]/20 flex items-center justify-center mb-6">
            <LuCircleCheck className="text-[#7C5CFC]" size={32} />
          </div>
          <h2 className="text-3xl font-semibold text-white mb-2">Password reset!</h2>
          <p className="text-gray-400 text-sm mb-8">
            Your password has been changed successfully.
          </p>
          <button
            onClick={onBackToLogin}
            className="w-full py-3.5 bg-[#7C5CFC] hover:bg-[#6B4EE6] text-white font-medium rounded-lg transition-colors"
          >
            Back to login
          </button>
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordForm