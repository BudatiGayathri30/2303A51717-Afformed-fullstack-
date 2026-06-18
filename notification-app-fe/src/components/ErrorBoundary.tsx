import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Box } from '@mui/material';
import { NetworkError } from './NetworkError';
import { logger } from '../shared/logger/logger';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }

  componentDidMount(): void {
    logger.info('component', 'ErrorBoundary mounted');
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logger.error('component', error.message);
    logger.debug('component', errorInfo.componentStack || 'Error boundary stack unavailable');
  }

  handleReload = (): void => {
    this.setState({
      hasError: false,
      error: null
    });

    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 3 }}>
          <Box sx={{ width: '100%', maxWidth: 720 }}>
            <NetworkError
              title="Application error"
              message={this.state.error?.message ?? 'Unexpected error occurred.'}
              error={this.state.error}
              onRetry={this.handleReload}
            />
          </Box>
        </Box>
      );
    }

    return this.props.children;
  }
}
