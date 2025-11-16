import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '@/lib/logger';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary component that catches JavaScript errors in child components
 * Provides graceful error handling and recovery options
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to our logging service
    logger.error('React ErrorBoundary caught an error', {
      error: error.toString(),
      componentStack: errorInfo.componentStack,
      stack: error.stack,
    });

    // Update state with error details
    this.setState({
      errorInfo,
    });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      const { error, errorInfo } = this.state;
      const { showDetails = process.env.NODE_ENV === 'development' } = this.props;

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
          <Card className="max-w-2xl w-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-red-500" />
                <CardTitle>Something went wrong</CardTitle>
              </div>
              <CardDescription>
                An unexpected error occurred. You can try to recover or reload the page.
              </CardDescription>
            </CardHeader>

            {showDetails && error && (
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-sm mb-2">Error Message:</h3>
                  <pre className="bg-red-50 text-red-900 p-3 rounded-md text-xs overflow-auto max-h-32">
                    {error.toString()}
                  </pre>
                </div>

                {error.stack && (
                  <div>
                    <h3 className="font-semibold text-sm mb-2">Stack Trace:</h3>
                    <pre className="bg-gray-100 p-3 rounded-md text-xs overflow-auto max-h-48">
                      {error.stack}
                    </pre>
                  </div>
                )}

                {errorInfo?.componentStack && (
                  <div>
                    <h3 className="font-semibold text-sm mb-2">Component Stack:</h3>
                    <pre className="bg-gray-100 p-3 rounded-md text-xs overflow-auto max-h-48">
                      {errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </CardContent>
            )}

            <CardFooter className="flex gap-2">
              <Button onClick={this.handleReset} variant="outline">
                Try Again
              </Button>
              <Button onClick={this.handleReload} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Reload Page
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Functional wrapper for ErrorBoundary with common presets
 */
export const CanvasErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        logger.error('Canvas error boundary triggered', {
          error: error.toString(),
          componentStack: errorInfo.componentStack,
        });
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

/**
 * Page-level error boundary with simplified error UI
 */
export const PageErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary
      showDetails={false}
      onError={(error, errorInfo) => {
        logger.error('Page error boundary triggered', {
          error: error.toString(),
          componentStack: errorInfo.componentStack,
        });
      }}
    >
      {children}
    </ErrorBoundary>
  );
};
