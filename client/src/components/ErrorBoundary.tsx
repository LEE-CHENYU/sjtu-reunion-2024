import React from "react";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen p-8 pt-20 bg-gradient-to-br from-blue-400 to-blue-600 text-white">
          <h1 className="text-4xl font-bold mb-4">Something went wrong 😕</h1>
          <p>Please try refreshing the page.</p>
        </div>
      );
    }

    return this.props.children;
  }
}
