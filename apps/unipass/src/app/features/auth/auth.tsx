import React, { useState } from 'react';
import AppIntro from './app-intro';
import SignUpForm from './sign-up';
import LoginForm from './sign-in';

export const AuthPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(false);

    return (
        <div className="h-screen w-screen flex items-center justify-center bg-[#1A1A24] p-4 sm:p-8 overflow-hidden">
            <div className="w-full h-full max-w-350 max-h-255 bg-[#232330] rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">

                <div className="w-full lg:w-1/2 relative hidden lg:block h-full">
                    <AppIntro />
                </div>

                <div className="w-full lg:w-1/2 h-full flex flex-col items-center justify-center p-6 sm:p-10 lg:p-4">
                    <div className="relative flex items-center bg-[#2D2D3A] rounded-full p-1 mb-4 w-64">
                        <div
                            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-[#7C5CFC] transition-transform duration-300 ease-in-out ${isLogin ? 'translate-x-[calc(100%+4px)]' : 'translate-x-0'
                                }`} />
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`relative z-10 flex-1 py-2 text-sm font-medium transition-colors duration-300 ${!isLogin ? 'text-white' : 'text-gray-400 hover:text-gray-200'
                                }`} >
                            Log In
                        </button>

                        <button
                            onClick={() => setIsLogin(true)}
                            className={`relative z-10 flex-1 py-2 text-sm font-medium transition-colors duration-300 ${isLogin ? 'text-white' : 'text-gray-400 hover:text-gray-200'
                                }`} >
                            Sign Up
                        </button>
                    </div>

                    <div className="w-full flex-1 flex items-center justify-center overflow-y-auto no-scrollbar">
                        {isLogin ? (
                            <SignUpForm onSwitchToLogin={() => setIsLogin(false)} />
                        ) : (
                            <LoginForm onSwitchToSignUp={() => setIsLogin(true)} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};