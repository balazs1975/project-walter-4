// src/components/ErrorToast.tsx
import React from 'react';
import { AlertCircle, CheckCircle, ChevronRight, X } from 'lucide-react';

interface ErrorToastProps {
  isVisible: boolean;
  message: string;
  isSuccess?: boolean;
  hasNext?: boolean;
  currentIndex?: number;
  totalErrors?: number;
  onNext?: () => void;
  onClose: () => void;
}

const ErrorToast: React.FC<ErrorToastProps> = ({
  isVisible,
  message,
  isSuccess = false,
  hasNext = false,
  currentIndex = 0,
  totalErrors = 0,
  onNext,
  onClose,
}) => {
  if (!isVisible) return null;

  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ${
      isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
    }`}>
      <div className={`max-w-md w-full mx-4 rounded-2xl shadow-2xl border backdrop-blur-sm ${
        isSuccess 
          ? 'bg-gradient-to-r from-green-500/90 to-emerald-500/90 border-green-400/30' 
          : 'bg-gradient-to-r from-red-500/90 to-orange-500/90 border-red-400/30'
      }`}>
        <div className="p-4">
          <div className="flex items-start space-x-3">
            {/* Icon */}
            <div className={`flex-shrink-0 p-1 rounded-full ${
              isSuccess ? 'bg-green-100/20' : 'bg-red-100/20'
            }`}>
              {isSuccess ? (
                <CheckCircle className="h-6 w-6 text-white" />
              ) : (
                <AlertCircle className="h-6 w-6 text-white" />
              )}
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className={`text-sm font-semibold text-white ${
                  isSuccess ? 'text-green-50' : 'text-red-50'
                }`}>
                  {isSuccess ? 'All Fields Complete!' : 'Required Field Missing'}
                </h3>
                
                {/* Progress indicator */}
                {!isSuccess && totalErrors > 1 && (
                  <span className="text-xs text-white/80 bg-white/20 px-2 py-1 rounded-full">
                    {currentIndex + 1} of {totalErrors}
                  </span>
                )}
              </div>
              
              <p className="mt-1 text-sm text-white/90 leading-relaxed">
                {message}
              </p>
            </div>
            
            {/* Close button */}
            <button
              onClick={onClose}
              className="flex-shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="h-4 w-4 text-white" />
            </button>
          </div>
          
          {/* Action buttons */}
          {hasNext && !isSuccess && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={onNext}
                className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-white text-sm font-medium transition-all transform hover:scale-105"
              >
                <span>Next Field</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
          
          {isSuccess && (
            <div className="mt-4 flex justify-center">
              <div className="text-center">
                <p className="text-sm text-green-50 font-medium">
                  🎉 Congratulations! Now you can press the Train Walter button
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorToast;