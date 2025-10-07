export const setupConsoleOverride = () => {
    if (typeof window !== 'undefined') {
      const originalError = console.error;
      console.error = (...args: unknown[]) => {
        if (
          typeof args[0] === 'string' && 
          args[0].includes('antd v5 support React is 16 ~ 18')
        ) {
          return;
        }
        originalError.apply(console, args);
      };
    }
  };