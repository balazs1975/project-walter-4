// src/components/LoginModal.tsx
import React from 'react';
import { createPortal } from 'react-dom';
import { X, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;   // <-- new optional prop
}

const LoginModal: React.FC<Props> = ({ open, onClose, onSuccess }) => {
  const { login } = useAuth();
  if (!open) return null;

  const handleLogin = () => {
    login().then(() => {
      onClose();
      onSuccess?.();
    });
  };

  const node = (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-md rounded-2xl bg-gray-900 p-8 shadow-2xl">
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="mb-8 text-center text-2xl font-bold text-white">
          Sign in to Walter’s Cube
        </h2>

        <button
          onClick={handleLogin}
          className="flex w-full items-center justify-center space-x-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 py-3 text-lg font-medium text-white hover:from-purple-500 hover:to-pink-500"
        >
          <LogIn className="h-5 w-5" />
          <span>Continue with Google</span>
        </button>
      </div>
    </div>
  );

  return createPortal(node, document.body);
};

export default LoginModal;
