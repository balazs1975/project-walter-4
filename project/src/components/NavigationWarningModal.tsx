// src/components/NavigationWarningModal.tsx
import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface NavigationWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onCancel: () => void;
}

const NavigationWarningModal: React.FC<NavigationWarningModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel}></div>
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border border-purple-500/20 max-w-md w-full shadow-2xl">
          {/* Close button */}
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          
          {/* Warning icon */}
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-3 rounded-full">
              <AlertTriangle className="h-8 w-8 text-white" />
            </div>
          </div>
          
          {/* Content */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Unsaved Changes
            </h2>
            <p className="text-gray-300 leading-relaxed">
              You have unsaved changes in your exhibition form. Are you sure you want to leave this page? All your progress will be lost.
            </p>
          </div>
          
          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-3 bg-white/10 border border-gray-600 rounded-xl text-white hover:bg-white/20 transition-all font-medium"
            >
              Stay on Page
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 rounded-xl text-white hover:from-red-500 hover:to-red-400 transition-all font-medium"
            >
              Leave Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationWarningModal;