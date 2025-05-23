import { toast as sonnerToast } from 'sonner';

// Default duration in milliseconds
const DEFAULT_DURATION = 5000;

// Create toast wrapper functions with default configurations
export const toast = {
  error: (message: string, options?: any) => 
    sonnerToast.error(message, { 
      duration: DEFAULT_DURATION, 
      id: `error-${Date.now()}`,
      ...options 
    }),
    
  success: (message: string, options?: any) => 
    sonnerToast.success(message, { 
      duration: DEFAULT_DURATION,
      id: `success-${Date.now()}`,
      ...options 
    }),
    
  info: (message: string, options?: any) => 
    sonnerToast.info(message, { 
      duration: DEFAULT_DURATION,
      id: `info-${Date.now()}`,
      ...options 
    }),

  warning: (message: string, options?: any) => 
    sonnerToast.warning(message, { 
      duration: DEFAULT_DURATION,
      id: `warning-${Date.now()}`,
      ...options 
    }),
    
  loading: (message: string, options?: any) => 
    sonnerToast.loading(message, {
      id: `loading-${Date.now()}`,
      ...options
    }),
    
  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    },
    options?: any
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
