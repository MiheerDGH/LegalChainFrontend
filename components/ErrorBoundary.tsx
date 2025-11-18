import React from 'react';

type State = { hasError: boolean; error?: Error | null; info?: string };

export default class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false, error: null, info: undefined };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // You can log to an external service here
    console.error('Uncaught error in React tree:', error, info);
    this.setState({ info: info?.componentStack ?? undefined });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
          <h2 style={{ color: '#b91c1c' }}>Something went wrong</h2>
          <p>The app encountered an unexpected error while rendering.</p>
          <details style={{ whiteSpace: 'pre-wrap', background: '#f8f8f8', padding: 12, borderRadius: 6 }}>
            <summary style={{ cursor: 'pointer' }}>Show error details</summary>
            <div>
              <strong>Error:</strong>
              <pre>{String(this.state.error?.message || this.state.error)}</pre>
              <strong>Stack / Component trace:</strong>
              <pre>{String(this.state.info || '')}</pre>
            </div>
          </details>
        </div>
      );
    }

    return this.props.children as React.ReactElement;
  }
}
