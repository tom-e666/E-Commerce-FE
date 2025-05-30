import { toast as sonnerToast } from 'sonner';

// Default duration in milliseconds
const DEFAULT_DURATION = 5000;

// Create toast wrapper functions with default configurations
export const toast = {
  error: (message: string, options?: Record<string, unknown>) => 
    sonnerToast.error(message, { 
      duration: DEFAULT_DURATION, 
      id: `error-${Date.now()}`,
      ...options 
    }),
    
  success: (message: string, options?: Record<string, unknown>) => 
    sonnerToast.success(message, { 
      duration: DEFAULT_DURATION,
      id: `success-${Date.now()}`,
      ...options 
    }),
    
  info: (message: string, options?: Record<string, unknown>) => 
    sonnerToast.info(message, { 
      duration: DEFAULT_DURATION,
      id: `info-${Date.now()}`,
      ...options 
    }),

  warning: (message: string, options?: Record<string, unknown>) => 
    sonnerToast.warning(message, { 
      duration: DEFAULT_DURATION,
      id: `warning-${Date.now()}`,
      ...options 
    }),
    
  loading: (message: string, options?: Record<string, unknown>) => 
    sonnerToast.loading(message, {
      id: `loading-${Date.now()}`,
      ...options
    }),
    
  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: unknown) => string);
    },
    options?: Record<string, unknown>
  ) => {
    const id = `promise-${Date.now()}`;
    return sonnerToast.promise(promise, {
      ...messages,
      id,
      duration: DEFAULT_DURATION,
      ...options
    });
  },

  dismiss: sonnerToast.dismiss
};
