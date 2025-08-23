import React, { useEffect, useState } from 'react';

export const ToastContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 space-y-3">
      {children}
    </div>
  );
};

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const SuccessIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ErrorIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300); // Wait for fade out animation
    }, 4700);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const baseClasses = "flex items-center justify-between max-w-xs w-full text-white rounded-component shadow-card p-4 transition-all duration-300 ease-smooth transform";
  const typeClasses = {
    success: 'bg-success',
    error: 'bg-error',
  };
  const visibilityClasses = visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0';

  return (
    <div
      className={`${baseClasses} ${typeClasses[type]} ${visibilityClasses}`}
    >
      <div className="flex items-center">
        {type === 'success' ? <SuccessIcon /> : <ErrorIcon />}
        <span className="font-medium text-sm">{message}</span>
      </div>
      <button onClick={onClose} className="text-white/80 hover:text-white ml-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};