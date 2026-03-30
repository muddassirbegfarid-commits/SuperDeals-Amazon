import React, { ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      let errorMessage = "Something went wrong. Please try again later.";
      
      try {
        // Check if it's a Firestore JSON error
        if (this.state.error?.message.startsWith('{')) {
          const errData = JSON.parse(this.state.error.message);
          if (errData.error.includes('insufficient permissions')) {
            errorMessage = "Access Denied: You don't have permission to perform this action.";
          }
        }
      } catch (e) {
        // Fallback to default message
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="bg-white p-8 rounded-xl shadow-lg border border-red-100 max-w-md w-full text-center">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="text-red-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! An error occurred</h2>
            <p className="text-gray-600 mb-8">{errorMessage}</p>
            <button
              onClick={this.handleReset}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCcw size={20} /> Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
