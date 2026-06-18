import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import '@fontsource/space-grotesk/400.css';
import '@fontsource/space-grotesk/700.css';
import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/500.css';
import '@fontsource/ibm-plex-sans/600.css';
import { App } from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ensureAuthReady } from './services/authService';
import { logger } from './shared/logger/logger';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
});

const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0f62fe'
    },
    secondary: {
      main: '#7c3aed'
    },
    success: {
      main: '#15803d'
    },
    warning: {
      main: '#d97706'
    },
    background: {
      default: '#f5f8ff',
      paper: '#ffffff'
    }
  },
  typography: {
    fontFamily: '"IBM Plex Sans", "Segoe UI", sans-serif',
    h1: {
      fontFamily: '"Space Grotesk", "IBM Plex Sans", sans-serif'
    },
    h2: {
      fontFamily: '"Space Grotesk", "IBM Plex Sans", sans-serif'
    },
    h3: {
      fontFamily: '"Space Grotesk", "IBM Plex Sans", sans-serif'
    },
    h4: {
      fontFamily: '"Space Grotesk", "IBM Plex Sans", sans-serif'
    },
    h5: {
      fontFamily: '"Space Grotesk", "IBM Plex Sans", sans-serif'
    },
    h6: {
      fontFamily: '"Space Grotesk", "IBM Plex Sans", sans-serif'
    }
  },
  shape: {
    borderRadius: 16
  }
});

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root container is missing');
}

const root = ReactDOM.createRoot(rootElement);

async function bootstrap(): Promise<void> {
  logger.info('component', 'Application bootstrap started');

  root.render(
    <StrictMode>
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <ErrorBoundary>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ErrorBoundary>
        </QueryClientProvider>
      </ThemeProvider>
    </StrictMode>
  );

  void ensureAuthReady().catch((error) => {
    const message = error instanceof Error ? error.message : 'Authentication bootstrap failed';
    logger.error('auth', message);
  });

  logger.info('component', 'Application bootstrap completed');
}

void bootstrap();
