import { useState, useCallback } from 'react';
import { type ToastProps } from '../components/Toast';

export const useToast = () => {
  const [toasts, setToasts] = useState<Array<ToastProps & { id: number }>>([]);
  let idCounter = 0;

  const showToast = useCallback((props: Omit<ToastProps, 'onClose'>) => {
    const id = ++idCounter;
    setToasts(prev => [...prev, { ...props, id, onClose: () => removeToast(id) }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = useCallback((message: string, duration?: number) => {
    showToast({ message, type: 'success', duration });
  }, [showToast]);

  const error = useCallback((message: string, duration?: number) => {
    showToast({ message, type: 'error', duration });
  }, [showToast]);

  const warning = useCallback((message: string, duration?: number) => {
    showToast({ message, type: 'warning', duration });
  }, [showToast]);

  const info = useCallback((message: string, duration?: number) => {
    showToast({ message, type: 'info', duration });
  }, [showToast]);

  return {
    toasts,
    showToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };
};