import React from 'react';

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

/**
 * Error Boundary component to catch JavaScript errors in child components.
 * Prevents entire app crashes and shows a fallback UI instead.
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = { hasError: false, error: null };

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-[400px] flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-brand-navy border border-slate-200 dark:border-brand-charcoal">
                    <div className="w-16 h-16 mb-6 text-brand-gold">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.054 0 1.918-.816 1.995-1.85L21 10.5a2 2 0 00-2-2H5a2 2 0 00-2 2l.087 6.65c.077 1.034.941 1.85 1.995 1.85z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 uppercase tracking-wider">
                        Something went wrong
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 text-center max-w-md">
                        We encountered an unexpected error. Please try refreshing the page.
                    </p>
                    <button
                        onClick={this.handleReset}
                        className="bg-brand-gold text-brand-dark px-8 py-3 font-bold text-xs uppercase tracking-widest hover:bg-brand-gold/90 transition-all"
                    >
                        Try Again
                    </button>
                    {import.meta.env.DEV && this.state.error && (
                        <pre className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs overflow-auto max-w-full rounded">
                            {this.state.error.message}
                        </pre>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
